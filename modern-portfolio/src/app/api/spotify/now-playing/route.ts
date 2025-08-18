import { NextRequest, NextResponse } from 'next/server'

const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

async function refreshSpotifyToken(refreshToken: string): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials')
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  const data = await response.json()
  return data.access_token
}

export async function GET(request: NextRequest) {
  try {
    // Use personal refresh token from environment for public access
    const personalRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN
    
    if (!personalRefreshToken) {
      // Return mock data for demo if personal token not configured
      const mockTrack = {
        name: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        image: "https://i.scdn.co/image/ab67616d0000b273c5b2e1cbb9a5c32e6e3fbb29",
        url: "https://open.spotify.com/track/0VjIjW4GlULA4LGcDBbN4V",
        isPlaying: true,
        progress: Math.floor(Math.random() * 180000),
        duration: 200040,
        isDemo: true
      }

      const isCurrentlyPlaying = Math.random() > 0.3
      if (!isCurrentlyPlaying) {
        return new NextResponse(null, { status: 204 })
      }

      return NextResponse.json(mockTrack)
    }

    // Get fresh access token using personal refresh token
    const accessToken = await refreshSpotifyToken(personalRefreshToken)

    // Fetch current playing track from Avni's account
    const response = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    if (!response.ok) {
      throw new Error('Failed to fetch current track')
    }

    const data = await response.json()
    
    return NextResponse.json({
      name: data.item.name,
      artist: data.item.artists[0].name,
      album: data.item.album.name,
      image: data.item.album.images[0]?.url,
      url: data.item.external_urls.spotify,
      isPlaying: data.is_playing,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
      isDemo: false,
      owner: 'avni123.girish'
    })

  } catch (error) {
    console.error('Spotify API Error:', error)
    
    // Fallback to demo data if there's any error
    const mockTrack = {
      name: "Demo Track - Not Currently Playing",
      artist: "Portfolio Demo",
      album: "Live Demo",
      image: "https://via.placeholder.com/300x300/1f2937/ffffff?text=No+Music",
      url: "https://open.spotify.com/",
      isPlaying: false,
      progress: 0,
      duration: 180000,
      isDemo: true
    }
    
    return NextResponse.json(mockTrack)
  }
}
