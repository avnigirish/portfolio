import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Check if password matches environment variable
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Set secure cookie for admin session
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'strict'
    })

    return response

  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
