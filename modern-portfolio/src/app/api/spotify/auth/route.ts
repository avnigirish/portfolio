import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`
  
  if (!clientId) {
    return NextResponse.json({ error: 'Spotify client ID not configured' }, { status: 500 })
  }

  // Check if this is being accessed from localhost (your development environment)
  const host = request.headers.get('host')
  if (!host?.includes('localhost') && !host?.includes('127.0.0.1')) {
    return NextResponse.json({ 
      error: 'Spotify authentication is only available for the site owner' 
    }, { status: 403 })
  }

  const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state'
  ].join(' ')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state: `spotify_auth_${process.env.SPOTIFY_USER_ID}`
  })

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
  
  return NextResponse.redirect(authUrl)
}
