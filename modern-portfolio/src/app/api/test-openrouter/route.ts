import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing OpenRouter API...')
    
    const testMessage = {
      model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'user',
          content: 'Hello, please respond with a simple test message.'
        }
      ],
      max_tokens: 100
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Avni Girish Portfolio Assistant - Test'
      },
      body: JSON.stringify(testMessage)
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      return NextResponse.json({
        error: 'API Error',
        status: response.status,
        details: errorText
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('Full API response:', JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      data: data,
      analysis: {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length || 0,
        hasMessage: !!data.choices?.[0]?.message,
        structure: Object.keys(data)
      }
    })

  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
