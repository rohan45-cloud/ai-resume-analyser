const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) and professional resume analyzer. 
Analyze the following resume text comprehensively and return a detailed JSON analysis.

RESUME TEXT:
${resumeText}

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "atsScore": <number 0-100>,
  "skills": {
    "found": [<list of technical and soft skills found>],
    "missing": [<list of commonly required skills not found>]
  },
  "strengths": [<list of 4-6 specific strengths>],
  "weaknesses": [<list of 3-5 specific weaknesses or areas to improve>],
  "education": {
    "summary": "<brief summary of education>",
    "details": [<list of education highlights>],
    "score": <number 0-100>
  },
  "experience": {
    "summary": "<brief summary of work experience>",
    "details": [<list of experience highlights>],
    "yearsOfExperience": <estimated years as number>,
    "score": <number 0-100>
  },
  "projects": {
    "summary": "<brief summary of projects>",
    "details": [<list of project highlights>],
    "count": <number of projects found>,
    "score": <number 0-100>
  },
  "keywords": {
    "found": [<important keywords found in resume>],
    "missing": [<important industry keywords missing>],
    "density": <keyword density percentage as number>
  },
  "suggestions": [<list of 6-8 specific actionable improvement suggestions>],
  "overallFeedback": "<2-3 sentence overall assessment of the resume>"
}

ATS Score criteria:
- 90-100: Excellent, highly optimized
- 70-89: Good, minor improvements needed
- 50-69: Average, significant improvements needed
- Below 50: Poor, major overhaul required

Be specific, professional, and constructive in your analysis.`;

  if (process.env.AI_PROVIDER === 'gemini' && genAI) {
    return await analyzeWithGemini(prompt);
  } else {
    return await analyzeWithOpenAI(prompt);
  }
};

const analyzeWithGemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('AI analysis failed. Please try again.');
  }
};

const analyzeWithOpenAI = async (prompt) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) throw new Error('OpenAI API request failed');
    
    const data = await response.json();
    const text = data.choices[0].message.content;
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('AI analysis failed. Please try again.');
  }
};

const matchJobDescriptionWithAI = async (resumeText, jobDescription, jobTitle) => {
  const prompt = `You are an expert HR consultant and ATS specialist.
Compare the following resume against the job description and return a detailed JSON analysis.

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "matchPercentage": <number 0-100>,
  "matchedSkills": [<skills from resume that match JD requirements>],
  "missingSkills": [<required skills from JD not found in resume>],
  "suggestions": [<5-7 specific suggestions to better align resume with this JD>],
  "keywordMatches": [<important keywords that matched>],
  "experienceMatch": "<assessment of experience alignment>",
  "overallAssessment": "<2-3 sentence overall match assessment>"
}

Be precise and focus on actual skill gaps and improvements.`;

  if (process.env.AI_PROVIDER === 'gemini' && genAI) {
    return await analyzeWithGemini(prompt);
  } else {
    return await analyzeWithOpenAI(prompt);
  }
};

module.exports = { analyzeResumeWithAI, matchJobDescriptionWithAI };
