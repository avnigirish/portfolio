'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Mail, 
  Activity, 
  TrendingUp, 
  Globe, 
  MessageSquare,
  BarChart3,
  Calendar,
  Eye,
  Clock,
  Shield,
  LogOut
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface AnalyticsData {
  visitors: {
    daily: { date: string; count: number; unique: number }[]
    monthly: { month: string; visitors: number; pageViews: number }[]
    total: number
    uniqueTotal: number
  }
  contacts: {
    messages: { date: string; name: string; email: string; subject: string; status: string }[]
    totalMessages: number
    responseRate: number
  }
  performance: {
    pageLoadTime: number
    bounceRate: number
    avgSessionDuration: number
    topPages: { page: string; views: number; avgTime: number }[]
  }
  geography: {
    countries: { country: string; visitors: number }[]
    cities: { city: string; visitors: number }[]
  }
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        setIsAuthenticated(true)
        await loadAnalytics()
      } else {
        alert('Invalid password')
      }
    } catch (error) {
      alert('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    setAnalytics(null)
  }

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 w-full max-w-md border border-white/20"
        >
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Enter password to access analytics</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter admin password"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Access Dashboard</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'visitors', label: 'Visitors', icon: Users },
    { id: 'contacts', label: 'Messages', icon: Mail },
    { id: 'performance', label: 'Performance', icon: Activity }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            Portfolio Analytics
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            )
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Stats Cards */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Total Visitors</p>
                    <p className="text-2xl font-bold text-white">{analytics.visitors.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Unique Visitors</p>
                    <p className="text-2xl font-bold text-white">{analytics.visitors.uniqueTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Mail className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Contact Messages</p>
                    <p className="text-2xl font-bold text-white">{analytics.contacts.totalMessages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Avg Session</p>
                    <p className="text-2xl font-bold text-white">{Math.round(analytics.performance.avgSessionDuration / 60)}m</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="lg:col-span-3 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Visitor Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.visitors.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="unique" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Top Countries</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.geography.countries}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="visitors"
                      nameKey="country"
                    >
                      {analytics.geography.countries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Recent Messages</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-gray-300 py-3">Date</th>
                      <th className="text-left text-gray-300 py-3">Name</th>
                      <th className="text-left text-gray-300 py-3">Email</th>
                      <th className="text-left text-gray-300 py-3">Subject</th>
                      <th className="text-left text-gray-300 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.contacts.messages.map((message, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="text-white py-3">{message.date}</td>
                        <td className="text-white py-3">{message.name}</td>
                        <td className="text-white py-3">{message.email}</td>
                        <td className="text-white py-3">{message.subject}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            message.status === 'replied' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {message.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
