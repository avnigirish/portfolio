import { NextRequest, NextResponse } from 'next/server'

const SPOTIFY_PLAYER_URL = 'https://api.spotify.com/v1/me/player'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const accessToken = request.cookies.get('spotify_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let endpoint = ''
    let method = 'PUT'

    switch (action) {
      case 'play':
        endpoint = `${SPOTIFY_PLAYER_URL}/play`
        break
      case 'pause':
        endpoint = `${SPOTIFY_PLAYER_URL}/pause`
        break
      case 'next':
        endpoint = `${SPOTIFY_PLAYER_URL}/next`
        method = 'POST'
        break
      case 'previous':
        endpoint = `${SPOTIFY_PLAYER_URL}/previous`
        method = 'POST'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 204) {
      return NextResponse.json({ success: true })
    }

    if (!response.ok) {
      const error = await response.text()
      console.error('Spotify playback error:', error)
      return NextResponse.json({ error: 'Playback control failed' }, { status: response.status })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Playback control error:', error)
    return NextResponse.json({ error: 'Failed to control playback' }, { status: 500 })
  }
}
