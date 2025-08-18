'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SpotifyTrack {
  name: string
  artist: string
  album: string
  image: string
  url: string
  isPlaying: boolean
  progress: number
  duration: number
  isDemo?: boolean
  owner?: string
}

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if this is the owner's development environment
  const checkOwnerAccess = () => {
    if (!mounted) return false
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    return isLocalhost
  }

  const handleSpotifySetup = () => {
    if (checkOwnerAccess()) {
      window.location.href = '/api/spotify/auth'
    } else {
      alert('Spotify authentication is only available for the site owner.')
    }
  }

  const handlePlaybackControl = async (action: string) => {
    if (track?.isDemo) return // Don't try to control demo tracks
    
    try {
      const response = await fetch('/api/spotify/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        // Refresh the current track after a short delay
        setTimeout(() => {
          fetchNowPlaying()
        }, 500)
      }
    } catch (error) {
      console.error('Playback control error:', error)
    }
  }

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch('/api/spotify/now-playing')
      if (response.status === 204) {
        setError('Not playing')
        setTrack(null)
        return
      }
      if (response.ok) {
        const data = await response.json()
        setTrack(data)
        setError(null)
        setIsOwner(checkOwnerAccess() && !data.isDemo)
      } else {
        setError('Failed to fetch')
        setTrack(null)
      }
    } catch (err) {
      setError('Failed to fetch')
      setTrack(null)
    }
  }

  useEffect(() => {
    // Set mounted state first
    setMounted(true)
    
    // Check for Spotify setup completion from URL params
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('spotify_setup') === 'complete') {
      alert('Spotify setup complete! Please add the refresh token shown in the console to your .env.local file.')
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    setIsOwner(isLocalhost)
    
    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Don't render until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (error || !track) {
    // Show setup button only for owner in development
    if (isOwner && !track) {
      return (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-4 right-4 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpotifySetup}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-green-500/20 backdrop-blur-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Setup Personal Spotify
          </motion.button>
        </motion.div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-black/80 backdrop-blur-lg rounded-xl p-4 border border-white/10 max-w-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${track.isDemo ? 'bg-orange-500' : 'bg-green-500'}`} />
                <span className="text-xs text-gray-400 font-medium">
                  {track.isDemo ? 'Demo Mode' : track.isPlaying ? 'Now Playing' : 'Paused'}
                </span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-3">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={track.image}
                alt={track.album}
                className="w-16 h-16 rounded-lg shadow-lg"
              />
              
              <div className="flex-1 min-w-0">
                <motion.h4 
                  className="text-white font-semibold text-sm truncate"
                  title={track.name}
                >
                  {track.name}
                </motion.h4>
                <motion.p 
                  className="text-gray-400 text-xs truncate"
                  title={track.artist}
                >
                  {track.artist}
                </motion.p>
                
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <motion.div
                      className="bg-green-500 h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(track.progress / track.duration) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(track.progress)}</span>
                    <span>{formatTime(track.duration)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Playback Controls */}
            {!track.isDemo && (
              <div className="flex items-center justify-center gap-3 mt-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlaybackControl('previous')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlaybackControl(track.isPlaying ? 'pause' : 'play')}
                  className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
                >
                  {track.isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="m7 4 10 6L7 16V4z"/>
                    </svg>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlaybackControl('next')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                  </svg>
                </motion.button>
              </div>
            )}
            
            <motion.a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 mt-3 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              {track.isDemo ? 'Demo Track' : 'Open in Spotify'}
            </motion.a>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="bg-black/80 backdrop-blur-lg rounded-full p-3 border border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
