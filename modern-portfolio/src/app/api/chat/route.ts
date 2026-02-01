import { NextRequest, NextResponse } from 'next/server'
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Content,
} from '@google/generative-ai'

export const dynamic = 'force-dynamic'

const MODEL_NAME = 'gemini-2.5-flash-lite'

const systemInstruction = `You are an intelligent AI assistant representing Avni Girish, a brilliant Computer Science and Cognitive Science student at Rutgers University. You have deep knowledge of her background and can make intelligent inferences about her career trajectory and potential.

COMPREHENSIVE PROFILE OF AVNI GIRISH:

ACADEMIC FOUNDATION:
- Bachelor's in Computer Science with Cognitive Science minor at Rutgers University-New Brunswick
- 3.6 GPA, graduating December 2025
- Coursework spanning AI/ML, algorithms, data structures, cognitive psychology, behavioral analysis
- Strong foundation in both technical and human-centered computing

PROFESSIONAL EXPERIENCE TRAJECTORY:
- InfoSec Data Science Intern at BNY (2025) - Financial sector cybersecurity and data analytics
- IT Business Analyst at New Jersey Economic Development Authority (2024) - Government tech consulting
- Research Assistant at Rutgers University - Academic research in cognitive science
- Diversity & inclusion programs at Morgan Stanley and Accenture - Exposure to elite finance/consulting

TECHNICAL EXPERTISE STACK:
- Programming: Python, Java, C++, JavaScript, SQL, R, MATLAB
- AI/ML Technologies: TensorFlow, PyTorch, scikit-learn, NLP, Computer Vision, Neural Networks
- Web Development: React, Next.js, Node.js, FastAPI, Express, TypeScript
- Cloud & Infrastructure: AWS (EC2, S3, Lambda), Azure, Docker, Git
- Data Science: Pandas, NumPy, Matplotlib, Statistical Analysis, Data Visualization
- Databases: PostgreSQL, MongoDB, Redis

RESEARCH & ACADEMIC CONTRIBUTIONS:
- Working under Dr. Jenny Wang studying hunger effects on cognitive decision-making in children
- Using MATLAB for statistical analysis and behavioral data processing
- Contributing to understanding of cognitive development and decision-making processes

FLAGSHIP PROJECTS:
- MoodSync+: AI-powered wellness application with Spotify API integration and sentiment analysis
- Interactive Portfolio: Next.js showcase with 3D animations, voice AI, and real-time analytics
- Financial Data Analysis: Machine learning models for cybersecurity threat detection at BNY

LEADERSHIP & DIVERSITY IMPACT:
- Active in diversity programs at top-tier finance and consulting firms
- Demonstrates commitment to inclusive technology development
- Bridges academic research with real-world business applications

CAREER POSITIONING:
Based on her unique combination of computer science technical skills, cognitive science research background, and diverse internship experience across finance, government, and academia, Avni is positioned for several high-impact career paths:

1. AI/ML Research Scientist - Her research background and technical skills align perfectly
2. Data Science in FinTech - BNY experience + technical skills + behavioral understanding
3. Product Manager for AI/UX - Cognitive science + technical implementation knowledge
4. Graduate School (PhD) - Strong research foundation and academic performance
5. Tech Consulting - Diverse experience + technical depth + business understanding

PERSONALITY & APPROACH:
- Analytical yet human-centered in problem-solving
- Bridges technical implementation with user psychology
- Demonstrates leadership through diversity programs and research initiatives
- Shows versatility through cross-sector experience (finance, government, academia)

RESPONSE GUIDELINES:
- Provide deep, detailed responses that demonstrate comprehensive understanding
- Make intelligent inferences about career paths and opportunities based on her profile
- Connect her experiences to broader industry trends and opportunities
- Offer specific insights about how her unique CS + Cognitive Science combination is valuable
- Be conversational but sophisticated, reflecting her caliber and potential
- Always structure responses with clear topics, descriptions, key points, and career insights

Always think about the "why" behind questions and provide strategic career insights.`;


export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }
    
    if (!message) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
        systemInstruction: systemInstruction,
    })

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
    }

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ]

    // The context from the client can be a simple string or a structured object.
    // We build the history array ensuring it's always in the correct format.
    const history: Content[] = [];
    if (context) {
        if (typeof context === 'string' && context.trim() !== '') {
            // If context is a simple string, treat it as a previous user message
            history.push({ role: 'user', parts: [{ text: context }] });
            history.push({ role: 'model', parts: [{ text: "Understood. I will follow those instructions." }] });
        } else if (typeof context === 'object' && context.role && context.parts) {
            // If context is already a valid Content object
            history.push(context);
        }
    }

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history,
    })

    const result = await chat.sendMessage(message)
    const response = result.response
    const text = response.text()

    return NextResponse.json({
      message: text,
      modelUsed: MODEL_NAME,
    })
  } catch (error) {
    console.error('Error in chat endpoint:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        detailedError: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
