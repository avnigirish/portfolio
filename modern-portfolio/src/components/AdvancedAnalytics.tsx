'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface HeatmapData {
  x: number
  y: number
  intensity: number
  timestamp: number
}

interface InteractionEvent {
  type: 'click' | 'scroll' | 'hover' | 'voice' | 'ai_interaction'
  element: string
  timestamp: number
  duration?: number
  metadata?: any
}

interface AnalyticsData {
  pageViews: Array<{ time: string; views: number }>
  interactionHeatmap: HeatmapData[]
  userBehavior: InteractionEvent[]
  skillEngagement: Array<{ skill: string; time: number; completions: number }>
  aiChatMetrics: Array<{ hour: string; queries: number; voiceUsage: number }>
  geographicData: Array<{ country: string; visits: number }>
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

export default function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeView, setActiveView] = useState<'overview' | 'heatmap' | 'behavior' | 'ai'>('overview')
  const heatmapRef = useRef<HTMLCanvasElement>(null)
  const trackingRef = useRef<{ isTracking: boolean; heatmapData: HeatmapData[] }>({
    isTracking: false,
    heatmapData: []
  })

  // Initialize analytics tracking
  useEffect(() => {
    const initializeTracking = () => {
      trackingRef.current.isTracking = true
      
      // Generate realistic demo data
      const generateDemoData = (): AnalyticsData => {
        const now = new Date()
        const pageViews = Array.from({ length: 24 }, (_, i) => ({
          time: `${String(i).padStart(2, '0')}:00`,
          views: Math.floor(Math.random() * 50) + 10
        }))

        const skillEngagement = [
          { skill: 'React/Next.js', time: 145, completions: 23 },
          { skill: 'TypeScript', time: 98, completions: 18 },
          { skill: 'AI Integration', time: 167, completions: 31 },
          { skill: 'Three.js', time: 89, completions: 12 },
          { skill: 'Python', time: 134, completions: 27 },
          { skill: 'Machine Learning', time: 156, completions: 19 }
        ]

        const aiChatMetrics = Array.from({ length: 24 }, (_, i) => ({
          hour: `${String(i).padStart(2, '0')}:00`,
          queries: Math.floor(Math.random() * 15) + 2,
          voiceUsage: Math.floor(Math.random() * 8) + 1
        }))

        const geographicData = [
          { country: 'United States', visits: 342 },
          { country: 'Canada', visits: 156 },
          { country: 'United Kingdom', visits: 98 },
          { country: 'Germany', visits: 87 },
          { country: 'Australia', visits: 76 },
          { country: 'India', visits: 234 }
        ]

        return {
          pageViews,
          interactionHeatmap: [],
          userBehavior: [],
          skillEngagement,
          aiChatMetrics,
          geographicData
        }
      }

      setData(generateDemoData())
    }

    // Mouse tracking for heatmap
    const trackMouseMovement = (e: MouseEvent) => {
      if (!trackingRef.current.isTracking) return

      const heatmapData = trackingRef.current.heatmapData
      const newPoint: HeatmapData = {
        x: e.clientX,
        y: e.clientY,
        intensity: 1,
        timestamp: Date.now()
      }

      // Check if point is close to existing points
      const existing = heatmapData.find(point => 
        Math.abs(point.x - newPoint.x) < 50 && 
        Math.abs(point.y - newPoint.y) < 50
      )

      if (existing) {
        existing.intensity += 0.1
      } else {
        heatmapData.push(newPoint)
      }

      // Limit heatmap data points
      if (heatmapData.length > 500) {
        heatmapData.splice(0, 100)
      }

      trackingRef.current.heatmapData = heatmapData
    }

    // Click tracking
    const trackClick = (e: MouseEvent) => {
      const element = (e.target as HTMLElement)?.tagName?.toLowerCase() || 'unknown'
      
      // Add interaction event
      setData(prev => prev ? {
        ...prev,
        userBehavior: [...prev.userBehavior, {
          type: 'click' as const,
          element,
          timestamp: Date.now()
        }].slice(-100) // Keep last 100 events
      } : null)
    }

    // Scroll tracking
    let scrollTimeout: NodeJS.Timeout
    const trackScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setData(prev => prev ? {
          ...prev,
          userBehavior: [...prev.userBehavior, {
            type: 'scroll' as const,
            element: 'page',
            timestamp: Date.now(),
            metadata: { scrollY: window.scrollY }
          }].slice(-100)
        } : null)
      }, 100)
    }

    initializeTracking()
    document.addEventListener('mousemove', trackMouseMovement)
    document.addEventListener('click', trackClick)
    document.addEventListener('scroll', trackScroll)

    return () => {
      trackingRef.current.isTracking = false
      document.removeEventListener('mousemove', trackMouseMovement)
      document.removeEventListener('click', trackClick)
      document.removeEventListener('scroll', trackScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  // Render heatmap on canvas
  useEffect(() => {
    if (!heatmapRef.current || !data) return

    const canvas = heatmapRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render heatmap points
    trackingRef.current.heatmapData.forEach(point => {
      const radius = Math.min(point.intensity * 30, 100)
      const alpha = Math.min(point.intensity * 0.3, 0.8)

      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      )
      gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`)
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [data, activeView])

  if (!data) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-4 bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Advanced Analytics Dashboard</h2>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Navigation */}
            <div className="flex gap-4 mt-4">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'heatmap', label: 'Heatmap' },
                { key: 'behavior', label: 'Behavior' },
                { key: 'ai', label: 'AI Metrics' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key as any)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeView === key 
                      ? 'bg-purple-500 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 h-[calc(100%-120px)] overflow-auto">
            {activeView === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Page Views */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Page Views (24h)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.pageViews}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Skill Engagement */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Skill Engagement</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.skillEngagement}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="skill" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Bar dataKey="time" fill="#8b5cf6" />
                      <Bar dataKey="completions" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Geographic Distribution */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Geographic Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.geographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="visits"
                      >
                        {data.geographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Real-time Metrics */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Real-time Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {data.userBehavior.filter(e => e.timestamp > Date.now() - 60000).length}
                      </div>
                      <div className="text-sm text-white/60">Interactions (1m)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        {trackingRef.current.heatmapData.length}
                      </div>
                      <div className="text-sm text-white/60">Heatmap Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {data.userBehavior.filter(e => e.type === 'click').length}
                      </div>
                      <div className="text-sm text-white/60">Total Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {Math.floor(Math.random() * 1000) + 500}
                      </div>
                      <div className="text-sm text-white/60">Session Duration (s)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'heatmap' && (
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-4">Mouse Movement Heatmap</h3>
                <p className="text-white/60 mb-4">Move your mouse around to see real-time heatmap data</p>
                <canvas
                  ref={heatmapRef}
                  className="absolute inset-0 pointer-events-none"
                  style={{ mixBlendMode: 'screen' }}
                />
                <div className="bg-white/5 rounded-xl p-4 h-96 relative overflow-hidden">
                  <div className="text-center mt-40">
                    <div className="text-white/40">Heatmap visualization area</div>
                    <div className="text-sm text-white/30 mt-2">
                      Active points: {trackingRef.current.heatmapData.length}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'behavior' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">User Behavior Analysis</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="space-y-2 max-h-80 overflow-auto">
                    {data.userBehavior.slice(-20).reverse().map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-white/80">
                          {event.type.toUpperCase()} on {event.element}
                        </span>
                        <span className="text-white/60 text-sm">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'ai' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">AI Chat Metrics</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.aiChatMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="hour" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Line type="monotone" dataKey="queries" stroke="#8b5cf6" strokeWidth={2} name="Text Queries" />
                      <Line type="monotone" dataKey="voiceUsage" stroke="#06b6d4" strokeWidth={2} name="Voice Usage" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsVisible(!isVisible)}
            className="fixed bottom-6 left-6 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-full shadow-lg z-40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {!isVisible && (
        <motion.button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-6 left-6 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg z-40 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="ml-2">Analytics</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
