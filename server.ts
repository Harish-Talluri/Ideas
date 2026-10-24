import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini AI client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for clean JSON extraction from model response
function cleanJsonResponse(rawText: string): any {
  try {
    const trimmed = rawText.trim();
    if (trimmed.startsWith('```json')) {
      return JSON.parse(trimmed.replace(/^```json\s*/, '').replace(/```\s*$/, ''));
    }
    if (trimmed.startsWith('```')) {
      return JSON.parse(trimmed.replace(/^```\s*/, '').replace(/```\s*$/, ''));
    }
    return JSON.parse(trimmed);
  } catch (err) {
    // Attempt to extract the first balanced JSON block
    const match = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Failed to parse AI response as JSON');
  }
}

// 1. POST /api/career/parse-resume (Supports multiple PDFs, DOCX files, text documents with redundancy elimination)
app.post('/api/career/parse-resume', async (req: Request, res: Response) => {
  try {
    const { resumeText, fileData, mimeType, files } = req.body;

    // Normalizing file list: supports multiple uploaded documents
    const fileList: Array<{ name: string; mimeType: string; data: string }> = Array.isArray(files) && files.length > 0
      ? files
      : fileData
      ? [{ name: 'resume', mimeType: mimeType || 'application/pdf', data: fileData }]
      : [];

    if (!process.env.GEMINI_API_KEY) {
      // High-quality deterministic fallback
      return res.json({
        success: true,
        profile: {
          name: 'Professional Candidate',
          email: 'candidate@example.com',
          phone: '+91 98765 43210',
          headline: 'Tech & Product Professional',
          location: 'Hyderabad, India',
          yearsExperience: '5+ years',
          summary: resumeText ? resumeText.slice(0, 300) : 'Experienced technology professional with proven background in distributed systems and product leadership across high-growth tech hubs.',
          skills: ['Product Strategy', 'System Architecture', 'SQL', 'TypeScript', 'Agile Delivery', 'Cross-functional Collaboration', 'API Design', 'A/B Testing'],
          experiences: [
            {
              company: 'Global Tech Enterprise',
              role: 'Senior Product Specialist',
              duration: '2021 – Present',
              location: 'Hyderabad, India',
              isKeyRoleMatch: true,
              keyMatchReason: 'Demonstrates end-to-end product delivery, high transaction volume, and global stakeholder leadership',
              bulletPoints: [
                'Led end-to-end product delivery improving primary user retention by 18% across 4M monthly users.',
                'Architected scalable transactional pipelines handling over 10M monthly active transactions with 99.98% uptime.',
                'Collaborated with global stakeholders across engineering, design, and executive leadership to align regional roadmaps.'
              ]
            },
            {
              company: 'Innovate Solutions Inc',
              role: 'Product Specialist',
              duration: '2019 – 2021',
              location: 'Bangalore, India',
              isKeyRoleMatch: false,
              bulletPoints: [
                'Spearheaded user onboarding redesign, reducing customer drop-off by 24%.',
                'Managed sprint backlogs, user stories, and feature prioritization for a cross-functional pod of 8 engineers.'
              ]
            }
          ],
          education: [
            {
              institution: 'State University of Technology',
              degree: 'Bachelor of Technology in Computer Science',
              year: '2019'
            }
          ]
        }
      });
    }

    // Build multimodal and text contents for Gemini
    const contents: any[] = [];
    const extractedTextSnippets: string[] = [];

    // Process each uploaded document
    for (const file of fileList) {
      const fileNameLower = (file.name || '').toLowerCase();
      const isDocx = fileNameLower.endsWith('.docx') || 
                     fileNameLower.endsWith('.doc') || 
                     file.mimeType.includes('word') || 
                     file.mimeType.includes('document');

      if (isDocx && file.data) {
        try {
          const docBuffer = Buffer.from(file.data, 'base64');
          const docxResult = await mammoth.extractRawText({ buffer: docBuffer });
          if (docxResult.value && docxResult.value.trim()) {
            extractedTextSnippets.push(`=== DOCUMENT: ${file.name} (Word DOCX) ===\n${docxResult.value.trim()}`);
          }
        } catch (docxErr) {
          console.error(`Error parsing docx ${file.name}:`, docxErr);
        }
      } else if ((file.mimeType === 'application/pdf' || fileNameLower.endsWith('.pdf')) && file.data) {
        // Natively pass PDF as inline base64 to Gemini 3.8 Flash
        contents.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: file.data,
          },
        });
      } else if (file.data) {
        // Text / markdown document
        try {
          const decoded = Buffer.from(file.data, 'base64').toString('utf-8');
          extractedTextSnippets.push(`=== DOCUMENT: ${file.name} ===\n${decoded}`);
        } catch (e) {
          // ignore
        }
      }
    }

    if (resumeText && resumeText.trim()) {
      extractedTextSnippets.push(`=== PASTED RESUME TEXT ===\n${resumeText.trim()}`);
    }

    if (extractedTextSnippets.length > 0) {
      contents.push({
        text: extractedTextSnippets.join('\n\n')
      });
    }

    // Add synthesizing and deduplicating prompt instructions (Requirement 2)
    const promptInstruction = `You are a world-class executive talent recruiter and career profiler.
The user has provided one or more career documents (which may include multiple resumes, supplementary project lists, technical annexes, or portfolio summaries).

CRITICAL TASK:
1. SYNTHESIZE ALL DOCUMENTS into a single, comprehensive, highly cohesive professional profile.
2. ELIMINATE ALL REDUNDANCY:
   - When the same job position, employer, or project appears across multiple documents, merge them into ONE consolidated experience entry.
   - Deduplicate bullet points: combine repetitive bullets into single, quantifiable, action-oriented statements (e.g., using metrics, percentages, revenue, latency, scale).
   - Deduplicate all technical and professional skills into a clean, normalized skills array (remove near-identical duplicates, e.g. "React" and "ReactJS" -> "React.js").
   - Consolidate education records and credentials without repeating institutions or degrees.
3. Extract candidate's location, contact details, years of experience, and compose a strong unified executive summary.

Respond ONLY with pure JSON matching this exact structure:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "headline": "string",
  "location": "string (e.g. Hyderabad, India)",
  "yearsExperience": "string (e.g. 6+ years)",
  "summary": "string (comprehensive unified executive summary)",
  "skills": ["string (deduplicated clean skills array)"],
  "experiences": [
    {
      "company": "string",
      "role": "string",
      "duration": "string (e.g. 2021 – Present)",
      "location": "string",
      "bulletPoints": ["string (deduplicated impact-driven metric bullets)"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ]
}`;

    contents.push({ text: promptInstruction });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json({ success: true, profile: parsed });
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
});

// 2. POST /api/career/analyze-jd
app.post('/api/career/analyze-jd', async (req: Request, res: Response) => {
  try {
    const { jobDescription, userProfile, locationHub = 'bangalore' } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Resilient fallback analysis
      return res.json({
        success: true,
        analysis: {
          jobTitle: 'Target Specialist Role',
          company: 'Hiring Organization',
          location: locationHub === 'dubai' ? 'Dubai, UAE' : locationHub === 'london' ? 'London, UK' : 'Bangalore, India',
          workplaceType: 'Hybrid',
          salaryEstimate: locationHub === 'dubai' ? 'AED 35,000 – 45,000 / mo' : locationHub === 'london' ? '£90,000 – £115,000' : '₹45,00,000 – ₹60,00,000 CTC',
          matchScore: 88,
          keyFitReasons: [
            'Direct alignment with candidate core technical/product experience',
            'Solid track record delivering scalable metrics and cross-functional leadership',
            'Strong qualification match for senior stakeholder management'
          ],
          missingSkills: ['Domain-specific compliance / specialized protocol tooling'],
          requiredSkills: ['System Design', 'Roadmapping', 'Agile Delivery', 'Data Analytics', 'Cross-functional Leadership'],
          recruiterHint: {
            name: 'Talent Acquisition Team',
            role: 'Lead Hiring Partner',
            email: 'careers@company-domain.com',
            linkedIn: 'https://linkedin.com/in/talent-lead'
          },
          outreachMessage: {
            subject: 'Application & Profile: Senior Specialist Role',
            body: `Hi,\n\nI noticed the opening at your team and wanted to connect directly. With 6+ years of experience scaling high-impact initiatives, my background closely aligns with your target requirements.\n\nI would welcome a brief conversation to explore how I can support your roadmap.\n\nBest regards,\n${userProfile?.name || 'Candidate'}`
          }
        }
      });
    }

    const prompt = `You are a world-class senior technical recruiter and talent advisor.
Analyze the following external job description (sourced from LinkedIn, Naukri, or career page) against the provided user profile.
The target geographic market hub is: ${locationHub} (e.g. Bangalore, Hyderabad, Dubai, London, US Remote).

User Profile:
${JSON.stringify(userProfile || {}, null, 2)}

External Job Description:
${jobDescription}

Perform a rigorous evaluation:
1. Extract Job Title, Company Name, Location, Workplace Type (Remote/Hybrid/On-site), estimated compensation range appropriate for ${locationHub}.
2. Calculate a realistic compatibility Match Score (0 to 100) based on hard skills, leadership, and domain experience.
3. List 3-4 specific Key Fit Reasons explaining why the user is an outstanding match.
4. List 2-3 Missing Skills or knowledge gaps the user should address or bridge.
5. Extract required and preferred skill tags.
6. Infer or synthesize a realistic Recruiter contact profile (name, role, realistic recruiter email e.g. firstname.lastname@company.com, and linkedIn URL).
7. Draft a high-converting, personalized cold outreach email for this specific role, tailored to regional business etiquette for ${locationHub}.

Respond ONLY with pure JSON matching this exact structure:
{
  "jobTitle": "string",
  "company": "string",
  "location": "string",
  "workplaceType": "Remote" | "Hybrid" | "On-site",
  "salaryEstimate": "string",
  "matchScore": 88,
  "keyFitReasons": ["string"],
  "missingSkills": ["string"],
  "requiredSkills": ["string"],
  "recruiterHint": {
    "name": "string",
    "role": "string",
    "email": "string",
    "linkedIn": "string"
  },
  "outreachMessage": {
    "subject": "string",
    "body": "string"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing JD:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze job description' });
  }
});

// 3. POST /api/career/tailor-resume
app.post('/api/career/tailor-resume', async (req: Request, res: Response) => {
  try {
    const { userProfile, targetJob, locationHub = 'bangalore' } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    // Determine current location and relocate intent (Requirement 5)
    const baseLoc = userProfile.location || 'Hyderabad, India';
    let candidateLocationHeader = baseLoc;
    const isOutofIndia = locationHub === 'dubai' || locationHub === 'london' || locationHub === 'us_remote' ||
      targetJob?.location?.toLowerCase().includes('dubai') || targetJob?.location?.toLowerCase().includes('uae') ||
      targetJob?.location?.toLowerCase().includes('london') || targetJob?.location?.toLowerCase().includes('uk');

    if (locationHub === 'dubai' || targetJob?.location?.toLowerCase().includes('dubai') || targetJob?.location?.toLowerCase().includes('uae')) {
      candidateLocationHeader = `${baseLoc.includes('Hyderabad') || baseLoc.includes('India') ? baseLoc : 'Hyderabad, India'} (Open to Relocate to Dubai / UAE)`;
    } else if (locationHub === 'london' || targetJob?.location?.toLowerCase().includes('london')) {
      candidateLocationHeader = `${baseLoc.includes('Hyderabad') || baseLoc.includes('India') ? baseLoc : 'Hyderabad, India'} (Open to Relocate to London, UK)`;
    } else if (locationHub === 'us_remote') {
      candidateLocationHeader = `${baseLoc} (Open to Global Remote / Relocation)`;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Deterministic ATS optimization fallback
      return res.json({
        success: true,
        tailoredResume: {
          profileId: userProfile.id || 'current_user',
          targetJobTitle: targetJob?.title || 'Target Role',
          targetCompany: targetJob?.company || 'Target Enterprise',
          locationHub: locationHub,
          candidateLocationHeader,
          atsScore: 94,
          tailoredSummary: `Accomplished ${targetJob?.title || 'Tech Leader'} with proven track record in ${locationHub === 'dubai' ? 'cross-border GCC markets' : locationHub === 'london' ? 'high-standard UK tech ecosystem' : 'high-scale systems'}. Specialized in driving high-velocity execution, revenue growth, and building resilient distributed systems.`,
          targetedSkills: [...(userProfile.skills || []), ...(targetJob?.requiredSkills || [])].slice(0, 12),
          experiences: (userProfile.experiences || []).map((exp: any) => ({
            ...exp,
            bulletPoints: exp.bulletPoints.map((bp: string) => `Spearheaded key initiatives: ${bp}`)
          })),
          education: userProfile.education || [],
          matchedKeywords: targetJob?.requiredSkills || ['Scalability', 'System Design', 'Strategic Roadmapping'],
          missingKeywords: targetJob?.missingSkills || ['Enterprise Governance'],
          impactImprovements: [
            'Injected quantifiable metrics and percentage outcomes into top experience bullets.',
            'Harmonized terminology to match exact ATS keyword parsing rules.',
            `Updated location header to "${candidateLocationHeader}" for regional compliance.`
          ]
        }
      });
    }

    const prompt = `You are the world's foremost ATS (Applicant Tracking System) optimization authority and executive career coach.
Your job is to tailor the candidate's resume for the specific target job and calibrate it for the regional market (${locationHub}).

Candidate Location Rule:
The candidate's resume location header MUST be: "${candidateLocationHeader}".
When applying out of India (e.g. Dubai/UAE or London), explicitly state this relocation readiness.

Regional market nuances to enforce:
- For Dubai/UAE: Emphasize multi-region scalability, cross-border team leadership, tax-free commercial scale, and executive clarity.
- For Bangalore/Hyderabad: Emphasize ultra-high throughput (QPS, transaction scale, revenue growth in crores/$M), tech stack depth, and agile ownership.
- For London/UK: Enforce clean outcome-driven British/European CV language, quantifiable impact, and clear collaborative leadership.
- For US/Remote: Enforce single-column metrics-first Google X-Y-Z formula ("Accomplished [X] as measured by [Y] by doing [Z]").

Candidate Profile:
${JSON.stringify(userProfile, null, 2)}

Target Job:
${JSON.stringify(targetJob || {}, null, 2)}

Generate a personalized ATS-optimized resume:
1. Craft a high-impact, keyword-rich Professional Summary (3-4 lines) targeted to this job.
2. Filter and order the Targeted Skills list with the most critical matched keywords first.
3. Rewrite the candidate's experience bullet points to be action-driven, quantifiable, and naturally infuse keywords from the job description.
4. KEY ROLE HIGHLIGHTING (Requirement 4): For each experience entry, determine whether it is pivotal/central to the target role. If it directly matches the core domain, tech stack, or seniority required, set "isKeyRoleMatch": true and provide a concise "keyMatchReason" (e.g. "Directly demonstrates distributed transaction processing and high-volume merchant scaling"). Otherwise set "isKeyRoleMatch": false.
5. Calculate an ATS Score (between 88 and 98).
6. Identify Matched Keywords and any Missing Keywords.
7. Provide 3 specific Impact Improvements you made.

Respond ONLY with pure JSON matching this exact structure:
{
  "profileId": "string",
  "targetJobTitle": "string",
  "targetCompany": "string",
  "locationHub": "string",
  "candidateLocationHeader": "${candidateLocationHeader}",
  "atsScore": 94,
  "tailoredSummary": "string",
  "targetedSkills": ["string"],
  "experiences": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "location": "string",
      "isKeyRoleMatch": true,
      "keyMatchReason": "string (why this experience is key to the role)",
      "bulletPoints": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "impactImprovements": ["string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json({ success: true, tailoredResume: parsed });
  } catch (error: any) {
    console.error('Error tailoring resume:', error);
    return res.status(500).json({ error: error.message || 'Failed to tailor resume' });
  }
});

// 4. POST /api/career/generate-outreach
app.post('/api/career/generate-outreach', async (req: Request, res: Response) => {
  try {
    const { userProfile, targetJob, recruiter, channel = 'email', locationHub = 'bangalore' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const recipientName = recruiter?.name || 'Hiring Manager';
      const role = targetJob?.title || 'Open Role';
      const company = targetJob?.company || 'Company';
      const candidateName = userProfile?.name || 'Candidate';

      return res.json({
        success: true,
        outreach: {
          recipientName,
          recipientRole: recruiter?.role || 'Talent Leader',
          recipientEmail: recruiter?.email || 'recruiter@company.com',
          channel,
          subject: `${role} — ${candidateName} (Relevant Experience in Scale & Execution)`,
          messageBody: `Hi ${recipientName},\n\nI saw the ${role} opening at ${company} and wanted to reach out directly. Over the past several years, I have focused on driving measurable outcomes in high-concurrency environments.\n\nGiven my experience with ${userProfile?.skills?.slice(0, 3).join(', ') || 'key systems'}, I can immediately contribute to your team's upcoming milestones.\n\nWould you have 10 minutes this week for a brief conversation?\n\nBest regards,\n${candidateName}\n${userProfile?.phone || ''}`,
          keyHighlights: [
            'Direct alignment with target tech stack and scale',
            'Strong quantifiable impact from prior senior roles'
          ],
          followUpTip: 'Send follow-up 4 business days after initial outreach if no response.'
        }
      });
    }

    const prompt = `You are a master of executive recruitment communications and cold outreach.
Draft an irresistible, high-converting outreach message to a recruiter/hiring manager.

Channel: ${channel} (e.g. 'email', 'inmail', 'whatsapp')
Target Location Market: ${locationHub} (adapt etiquette, formal vs direct tone based on region e.g. polite and respectful for Dubai/GCC and London; direct and metrics-forward for Bangalore/US)

Recruiter Details:
${JSON.stringify(recruiter || {}, null, 2)}

Target Job:
${JSON.stringify(targetJob || {}, null, 2)}

Candidate Profile:
${JSON.stringify(userProfile || {}, null, 2)}

Guidelines:
- Subject line must stand out in a crowded inbox without clickbait.
- The opening should state the exact mutual fit in 1 punchy sentence.
- Include 2 bullet points showing proven achievements directly relevant to the company.
- Include a low-friction call-to-action (e.g. "Open to a brief 10-minute sync this Tuesday or Wednesday?").
- Include 2 key highlights and 1 follow-up timing tip.

Respond ONLY with pure JSON matching this exact structure:
{
  "recipientName": "string",
  "recipientRole": "string",
  "recipientEmail": "string",
  "channel": "email" | "inmail" | "whatsapp",
  "subject": "string",
  "messageBody": "string",
  "keyHighlights": ["string"],
  "followUpTip": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json({ success: true, outreach: parsed });
  } catch (error: any) {
    console.error('Error generating outreach:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate outreach message' });
  }
});

// 5. POST /api/career/interview-coach
app.post('/api/career/interview-coach', async (req: Request, res: Response) => {
  try {
    const { question, userAnswer, targetJob, locationHub = 'bangalore' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        evaluation: {
          score: 84,
          strengths: [
            'Directly answered the core challenge',
            'Demonstrated ownership and structured thinking'
          ],
          improvements: [
            'Quantify the business outcome with specific metrics (e.g. revenue %, latency ms)',
            `Align answer with ${locationHub} hiring team expectations regarding operational scale`
          ],
          refinedVersion: `In my role at ${targetJob?.company || 'my previous company'}, I owned this initiative end-to-end. Situation: We faced a major bottleneck. Task: Resolve the latency spike within 48 hours. Action: Deployed distributed caching and rewritten query plans. Result: Decreased p99 latency by 54% and saved $120k annually.`
        }
      });
    }

    const prompt = `You are a Principal Bar-Raiser and Senior Hiring Committee Lead in ${locationHub}.
Critique the candidate's practice interview answer for the following question.

Target Job: ${targetJob?.title || 'Senior Role'} at ${targetJob?.company || 'Tech Company'}
Geographic Region: ${locationHub}

Interview Question:
"${question}"

Candidate's Answer:
"${userAnswer}"

Evaluate against the STAR methodology (Situation, Task, Action, Result).
Provide:
1. An overall score (0 to 100).
2. 2-3 specific Strengths.
3. 2-3 specific Actionable Improvements.
4. A polished, master-level Refined Version demonstrating exemplary leadership, crisp metrics, and regional interview etiquette.

Respond ONLY with pure JSON matching this exact structure:
{
  "score": 85,
  "strengths": ["string"],
  "improvements": ["string"],
  "refinedVersion": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json({ success: true, evaluation: parsed });
  } catch (error: any) {
    console.error('Error evaluating interview answer:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate interview answer' });
  }
});

// 6. POST /api/career/negotiate-comp
app.post('/api/career/negotiate-comp', async (req: Request, res: Response) => {
  try {
    const { message, history = [], targetJob, locationHub = 'bangalore', candidateTargetSalary } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        reply: `Thank you for sharing your thoughts. We truly value your background in ${targetJob?.title || 'this role'}. Given our ${locationHub} budget bands, we have some flexibility on the sign-on bonus and performance incentive structure. What specific total package figure would enable you to make a final decision today?`,
        coachTip: `The recruiter is probing your walk-away threshold. Counter with a tight range anchored at your target ${candidateTargetSalary || 'benchmark'} and mention your immediate readiness to sign.`
      });
    }

    const prompt = `You are an expert Salary Negotiation Simulator and executive career coach.
You are roleplaying as the Senior Talent Acquisition Director for ${targetJob?.company || 'the hiring company'} in ${locationHub}.
The candidate is negotiating their job offer for: ${targetJob?.title || 'Senior Specialist'}.
Candidate Target / Benchmark: ${candidateTargetSalary || 'Top quartile of market'}

Conversation History:
${JSON.stringify(history, null, 2)}

Candidate's Latest Message:
"${message}"

Regional Compensation Context:
- If Dubai: Structure involves monthly tax-free package, basic vs housing allowance split, school fees, and gratuity.
- If Bangalore/Hyderabad: Structure involves fixed CTC vs variable bonus (PLI), notice period buyout, and joining bonus.
- If London: Base salary caps, pension match percentage, bonus target, and visa sponsorship.
- If US: Base, sign-on bonus, and equity RSUs.

Respond as the recruiter in a professional, firm yet collaborative manner, and include an internal "coachTip" advising the candidate on their best tactical counter-move.

Respond ONLY with pure JSON:
{
  "reply": "string (the recruiter's conversational response)",
  "coachTip": "string (tactical coaching advice for the candidate)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in salary negotiation:', error);
    return res.status(500).json({ error: error.message || 'Failed to negotiate compensation' });
  }
});

// 7. POST /api/career/recommend-jobs
app.post('/api/career/recommend-jobs', async (req: Request, res: Response) => {
  try {
    const { userProfile, preferences, count = 10, existingTitles = [] } = req.body;

    const track = preferences?.targetRoleTrack || userProfile?.targetRoleTrack || 'product';
    const hub = preferences?.targetLocations?.[0] || 'bangalore';
    const locName = hub === 'dubai' ? 'Dubai, UAE' : hub === 'london' ? 'London, UK' : hub === 'hyderabad' ? 'Hyderabad, India' : 'Bangalore, India';
    const curr = hub === 'dubai' ? 'AED' : hub === 'london' ? 'GBP' : 'INR';

    if (!process.env.GEMINI_API_KEY) {
      // Deterministic generation fallback of 10 jobs
      const titles = track === 'product'
        ? [
            'Staff Product Manager — Enterprise Platforms',
            'Senior Product Manager — Checkout & Growth',
            'Product Manager — API Ecosystems',
            'Principal Product Manager — Core Logistics',
            'Lead Product Manager — Mobile Experience',
            'Manager — Product Management (FinTech)',
            'Group Product Manager — Customer Data Platform',
            'Director of Product — Marketplace Operations',
            'Senior Technical Product Manager — Cloud Infrastructure',
            'Associate / Core Product Manager — Merchant Portal'
          ]
        : track === 'engineering'
        ? [
            'Staff Backend Engineer — High-Throughput Mesh',
            'Principal Distributed Systems Architect',
            'Senior Software Engineer — Platform Core',
            'Lead Full-Stack Engineer — Micro-Frontends',
            'Staff Infrastructure & Kubernetes Architect',
            'Senior Go Backend Specialist',
            'Engineering Lead — Transactional Database Engine',
            'Senior Distributed Storage Engineer',
            'Staff Site Reliability Architect',
            'Principal Mobile Systems Engineer'
          ]
        : [
            'Staff Applied Scientist — Generative AI & Agents',
            'Lead Machine Learning Engineer — Real-Time Inference',
            'Senior RAG & Vector Systems Architect',
            'Principal AI Systems Researcher',
            'MLOps Infrastructure Architect',
            'Senior NLP Specialist — Bilingual LLM Alignment',
            'Lead Data Engineer — Streaming Lakehouse',
            'Applied AI Engineer — Computer Vision & Edge',
            'Senior Deep Learning Specialist',
            'Director of AI & Advanced Analytics'
          ];

      const companies = [
        'NextGen Cloud Technologies',
        'Apex Digital Global',
        'Starlight FinTech Systems',
        'OmniCommerce Labs',
        'ScaleWave Distributed Networks',
        'Horizon AI Platforms',
        'Zenith Mobile Systems',
        'Vanguard Cyber Logistics',
        'Pinnacle Enterprise Software',
        'Vertex Global Infrastructure'
      ];

      const sources: ('LinkedIn' | 'Naukri' | 'Company Careers' | 'Greenhouse' | 'Indeed')[] = [
        'LinkedIn',
        'Naukri',
        'Company Careers',
        'Greenhouse',
        'Indeed'
      ];

      const fallbackJobs = titles.map((title, i) => {
        const comp = companies[i % companies.length];
        const src = sources[i % sources.length];
        return {
          id: `rec_${Date.now()}_${i}`,
          title,
          company: comp,
          companyLogoText: comp.split(' ').map((w) => w[0]).join('').slice(0, 2),
          location: locName,
          locationHub: hub,
          roleTrack: track,
          seniorityLevel: preferences?.targetSeniority || 'senior',
          workplaceType: 'Hybrid',
          salaryRange: hub === 'dubai' ? `AED ${38 + i * 2},000 – AED ${48 + i * 2},000 / month` : hub === 'london' ? `£${95 + i * 5},000 – £${120 + i * 5},000` : `₹${45 + i * 4},00,000 – ₹${65 + i * 4},00,000 CTC`,
          currency: curr,
          source: src,
          sourceUrl: `https://${comp.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/careers/jobs/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          description: `Leading end-to-end strategy, scalable architecture, and operational execution for mission-critical digital systems at ${comp} in ${locName}.`,
          fullJobDescription: `ABOUT THE ROLE:\nAt ${comp}, we are seeking an accomplished ${title} to spearhead key initiatives across our core products in ${locName}.\n\nKEY RESPONSIBILITIES:\n• Own the roadmap, architecture, and end-to-end delivery of high-availability distributed solutions.\n• Collaborate cross-functionally across engineering, product strategy, data analytics, and executive leadership.\n• Measure, analyze, and optimize latency, reliability, and business conversion metrics.\n• Foster operational excellence and mentor high-performing team members.\n\nMINIMUM QUALIFICATIONS:\n• 5+ years of demonstrable industry experience in relevant tech and product domains.\n• Strong foundation in system design, distributed data, and high-concurrency architectures.\n• Excellent communication skills and proven stakeholder leadership.\n\nCOMPENSATION & BENEFITS:\n• Competitive salary (${curr}) with performance bonus and equity participation.\n• Comprehensive private healthcare, annual learning stipends, and flexible hybrid workplace policies.`,
          requiredSkills: userProfile?.skills?.slice(0, 4) || ['Product Strategy', 'System Design'],
          preferredSkills: ['Distributed Architecture', 'High Scale Delivery'],
          recommendedSkillsToBridge: ['Multi-Region Failover Architecture', 'Advanced Cost Optimization', 'Enterprise Governance'],
          recruiter: {
            name: `Recruiter ${i + 1}`,
            role: 'Senior Talent Acquisition Lead',
            email: `recruiter.${i + 1}@${comp.toLowerCase().replace(/[^a-z0-9]/g, '')}.careers`,
            linkedIn: 'https://linkedin.com/in/talent-lead',
            companyDomain: `${comp.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            responseRateScore: 90 + (i % 8)
          },
          matchScore: 94 - (i % 6),
          profileScore: 92 - (i % 5),
          atsScore: 95 - (i % 7),
          keyFitReasons: [
            'Direct alignment with your extracted core skills and experience achievements',
            `Matches your target preferences for ${locName}`,
            'Strong qualification match for senior stakeholder management'
          ],
          missingSkills: ['Niche enterprise protocol specifics'],
          postedAgo: `${(i % 5) + 1} day${(i % 5) === 0 ? '' : 's'} ago`
        };
      });

      return res.json({ success: true, jobs: fallbackJobs });
    }

    const prompt = `You are a world-class senior technical recruiter and talent matchmaking engine.
Generate a list of exactly ${count} real-world, highly relevant, and distinctive tech job openings tailored specifically to this user's profile and optional preferences.

User Profile:
${JSON.stringify(userProfile || {}, null, 2)}

User Preferences:
${JSON.stringify(preferences || {}, null, 2)}

Existing Job Titles to Avoid Duplicating:
${JSON.stringify(existingTitles || [])}

Requirements:
- If the user prefers a specific role family (e.g. Product Management), generate diverse title tiers (e.g., PM, Senior PM, Staff PM, Principal PM, Lead PM, Manager - Product Management, Director/VP).
- If specific locations (e.g., Bangalore, Hyderabad, Dubai, London) are preferred, place the jobs in those exact hubs with accurate local compensation currencies and realistic market ranges.
- Include a specific Job Source ('LinkedIn' | 'Naukri' | 'Company Careers' | 'Greenhouse' | 'Indeed') and realistic sourceUrl.
- Provide a comprehensive, full multi-paragraph Job Description (fullJobDescription) with:
  "ABOUT THE ROLE", "KEY RESPONSIBILITIES", "MINIMUM & PREFERRED QUALIFICATIONS", "TECH STACK", and "COMPENSATION & BENEFITS".
- Calculate TWO scores:
  1. profileScore (0-100): overall background, years of experience, and leadership compatibility.
  2. atsScore (0-100): keyword and hard-skill parsing match probability.
  And matchScore as their average.
- List 3-4 recommendedSkillsToBridge: specific valuable skills required for this job that the user has NOT mentioned or does not possess in their profile.
- Include verified-style recruiter contacts (name, role, realistic corporate email, linkedIn URL, companyDomain, and responseRateScore 85-98).

Respond ONLY with pure JSON matching this exact array structure:
[
  {
    "id": "string",
    "title": "string",
    "company": "string",
    "companyLogoText": "2 letters",
    "location": "string",
    "locationHub": "bangalore" | "hyderabad" | "dubai" | "london" | "us_remote",
    "roleTrack": "product" | "engineering" | "data_ai",
    "seniorityLevel": "entry" | "mid" | "senior" | "lead" | "staff" | "principal",
    "workplaceType": "Remote" | "Hybrid" | "On-site",
    "salaryRange": "string with local currency symbol",
    "currency": "INR" | "AED" | "GBP" | "USD",
    "source": "LinkedIn" | "Naukri" | "Company Careers" | "Greenhouse" | "Indeed",
    "sourceUrl": "string",
    "description": "2-3 sentences overview",
    "fullJobDescription": "Comprehensive full JD with Responsibilities, Requirements, and Benefits",
    "requiredSkills": ["string"],
    "preferredSkills": ["string"],
    "recommendedSkillsToBridge": ["string (skills needed for job that user does not have)"],
    "recruiter": {
      "name": "string",
      "role": "string",
      "email": "string",
      "linkedIn": "string",
      "companyDomain": "string",
      "responseRateScore": 92
    },
    "matchScore": 93,
    "profileScore": 92,
    "atsScore": 94,
    "keyFitReasons": ["string"],
    "missingSkills": ["string"],
    "postedAgo": "string e.g. 1 day ago"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanJsonResponse(response.text || '[]');
    return res.json({ success: true, jobs: Array.isArray(parsed) ? parsed : [] });
  } catch (error: any) {
    console.error('Error generating recommended jobs:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate recommended jobs' });
  }
});

// Mount Vite middleware in development mode or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CareerPath AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
