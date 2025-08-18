import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?spotify_error=${error}`)
  }

  if (!code || !state?.startsWith(`spotify_auth_${process.env.SPOTIFY_USER_ID}`)) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?spotify_error=invalid_request`)
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not configured')
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    console.log('==========================================')
    console.log('IMPORTANT: Save this refresh token to your .env.local file:')
    console.log(`SPOTIFY_REFRESH_TOKEN=${tokenData.refresh_token}`)
    console.log('==========================================')

    // Create response with success message
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?spotify_setup=complete`)
    
    return response

  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?spotify_error=callback_failed`)
  }
}
