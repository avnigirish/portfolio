import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API not configured' },
        { status: 500 }
      )
    }

    // Check if the model supports function calling
    const supportsTools = !process.env.OPENROUTER_MODEL?.includes('deepseek')
    
    const requestBody: any = {
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: `${context}

You are an intelligent AI assistant representing Avni Girish, a brilliant Computer Science and Cognitive Science student at Rutgers University. You have deep knowledge of her background and can make intelligent inferences about her career trajectory and potential.

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
- Investigating cognitive components of numerical understanding
- Using advanced statistical methods and MATLAB for data analysis
- Contributing to academic understanding of cognitive-behavioral patterns

FLAGSHIP PROJECTS:
- MoodSync+: AI-powered wellness application with Spotify API integration and sentiment analysis
- Automated Car Simulation: Neural network-based autonomous vehicle navigation system
- Sentiment Analysis Tools: 95% accuracy NLP models for emotion detection
- Real-time Data Dashboards: Interactive visualization platforms for complex datasets

CAREER TRAJECTORY ANALYSIS:
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

Always think about the "why" behind questions and provide strategic career insights.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    }

    // Only add tools if the model supports them
    if (supportsTools) {
      requestBody.tools = [
        {
          type: 'function',
          function: {
            name: 'structure_response',
            description: 'Structure the response with topic, description, and key points',
            parameters: {
              type: 'object',
              properties: {
                topic: {
                  type: 'string',
                  description: 'The main topic being discussed'
                },
                description: {
                  type: 'string',
                  description: 'A brief description of the topic'
                },
                key_points: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Detailed key points with specific insights and analysis'
                },
                career_insights: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Strategic career insights and opportunities based on her profile'
                },
                related_areas: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Related areas they might want to explore'
                }
              },
              required: ['topic', 'description', 'key_points']
            }
          }
        }
      ]
      requestBody.tool_choice = 'auto'
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Avni Girish Portfolio Assistant'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenRouter API error: ${response.status} - ${errorText}`)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('OpenRouter API response:', JSON.stringify(data, null, 2))
    
    // Check if the response contains an error
    if (data.error) {
      console.error('OpenRouter API error:', data.error)
      throw new Error(`OpenRouter API error: ${data.error.message || 'Unknown error'}`)
    }
    
    // Handle different response structures
    const assistantMessage = data.choices?.[0]?.message || data.message || null
    
    if (!assistantMessage) {
      console.error('No assistant message found in response:', data)
      throw new Error('Invalid response structure from OpenRouter API')
    }

    let structuredData = null
    let responseText = assistantMessage?.content || 'I apologize, but I encountered an issue processing your request.'

    // Check if the assistant used the structured response tool
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0]
      if (toolCall.function.name === 'structure_response') {
        try {
          structuredData = JSON.parse(toolCall.function.arguments)
        } catch (e) {
          console.error('Failed to parse structured response:', e)
        }
      }
    }

    return NextResponse.json({
      response: responseText,
      structured: structuredData,
      model: data.model || 'unknown',
      usage: data.usage || null
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return a proper error response
    return NextResponse.json({
      response: 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again in a moment.',
      structured: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
