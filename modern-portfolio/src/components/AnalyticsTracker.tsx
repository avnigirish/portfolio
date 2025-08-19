'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/admin/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'page_view',
            data: {
              page: pathname,
              timestamp: new Date().toISOString(),
              referrer: document.referrer,
              userAgent: navigator.userAgent,
              screen: {
                width: window.screen.width,
                height: window.screen.height
              },
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight
              }
            }
          })
        })
      } catch (error) {
        // Silent fail for analytics
        console.debug('Analytics tracking failed:', error)
      }
    }

    // Track when user arrives
    trackPageView()

    // Track when user leaves (for session duration)
    const handleBeforeUnload = () => {
      const sessionEnd = Date.now()
      const sessionStart = parseInt(sessionStorage.getItem('session_start') || '0')
      const duration = sessionEnd - sessionStart

      fetch('/api/admin/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'session_end',
          data: {
            page: pathname,
            duration: duration,
            timestamp: new Date().toISOString()
          }
        }),
        keepalive: true // Ensure request completes even if page is closing
      }).catch(() => {}) // Silent fail
    }

    // Store session start time
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', Date.now().toString())
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])

  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent
        
        // Track milestone scroll depths
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          fetch('/api/admin/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event: 'scroll_depth',
              data: {
                page: pathname,
                depth: scrollPercent,
                timestamp: new Date().toISOString()
              }
            })
          }).catch(() => {}) // Silent fail
        }
      }
    }

    const throttledTrackScrollDepth = throttle(trackScrollDepth, 500)
    window.addEventListener('scroll', throttledTrackScrollDepth)

    return () => {
      window.removeEventListener('scroll', throttledTrackScrollDepth)
    }
  }, [pathname])

  return null // This component doesn't render anything
}

// Utility function to throttle events
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}

// Export utility functions for manual tracking
export const trackEvent = async (eventName: string, data?: any) => {
  try {
    await fetch('/api/admin/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
        }
      })
    })
  } catch (error) {
    console.debug('Event tracking failed:', error)
  }
}

// Track specific interactions
export const trackContactFormSubmit = () => trackEvent('contact_form_submit')
// Removed trackSpotifyInteraction as part of Spotify feature cleanup.
export const trackAIChatMessage = (message: string) => trackEvent('ai_chat_message', { messageLength: message.length })
export const trackProjectView = (projectName: string) => trackEvent('project_view', { project: projectName })
