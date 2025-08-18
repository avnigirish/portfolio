'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Area, AreaChart } from 'recharts'
import AnimatedBackground from './AnimatedBackground'

export default function DataVisualization() {
  const [activeChart, setActiveChart] = useState('skills')

  // Sample data for different visualizations
  const skillsData = [
    { skill: 'Python', proficiency: 95, projects: 15, learning: 88 },
    { skill: 'JavaScript', proficiency: 90, projects: 12, learning: 85 },
    { skill: 'Java', proficiency: 85, projects: 8, learning: 80 },
    { skill: 'React', proficiency: 92, projects: 10, learning: 90 },
    { skill: 'AI/ML', proficiency: 88, projects: 6, learning: 95 },
    { skill: 'SQL', proficiency: 82, projects: 9, learning: 75 },
    { skill: 'AWS', proficiency: 78, projects: 5, learning: 85 },
    { skill: 'Node.js', proficiency: 85, projects: 7, learning: 82 }
  ]

  const projectImpactData = [
    { month: 'Jan', productivity: 65, efficiency: 70, innovation: 75, complexity: 60 },
    { month: 'Feb', productivity: 72, efficiency: 75, innovation: 80, complexity: 68 },
    { month: 'Mar', productivity: 78, efficiency: 82, innovation: 85, complexity: 75 },
    { month: 'Apr', productivity: 85, efficiency: 88, innovation: 90, complexity: 82 },
    { month: 'May', productivity: 88, efficiency: 85, innovation: 92, complexity: 88 },
    { month: 'Jun', productivity: 92, efficiency: 90, innovation: 95, complexity: 90 }
  ]

  const experienceData = [
    { name: 'BNY InfoSec Data Science', value: 35, color: '#8B5CF6' },
    { name: 'NJEDA IT Consulting', value: 25, color: '#06B6D4' },
    { name: 'Rutgers Research Lab', value: 30, color: '#10B981' },
    { name: 'Personal Projects', value: 10, color: '#F59E0B' }
  ]

  const radarData = [
    { subject: 'Technical Skills', A: 95, B: 90, fullMark: 100 },
    { subject: 'Problem Solving', A: 92, B: 88, fullMark: 100 },
    { subject: 'Research', A: 88, B: 85, fullMark: 100 },
    { subject: 'Communication', A: 85, B: 82, fullMark: 100 },
    { subject: 'Leadership', A: 82, B: 78, fullMark: 100 },
    { subject: 'Innovation', A: 90, B: 85, fullMark: 100 }
  ]

  const skillEvolutionData = [
    { time: 'Month 1', Python: 70, JavaScript: 65, React: 60, AI: 55, AWS: 50 },
    { time: 'Month 2', Python: 75, JavaScript: 70, React: 68, AI: 62, AWS: 58 },
    { time: 'Month 3', Python: 82, JavaScript: 78, React: 75, AI: 70, AWS: 65 },
    { time: 'Month 4', Python: 88, JavaScript: 85, React: 85, AI: 78, AWS: 72 },
    { time: 'Month 5', Python: 92, JavaScript: 88, React: 90, AI: 85, AWS: 75 },
    { time: 'Month 6', Python: 95, JavaScript: 90, React: 92, AI: 88, AWS: 78 }
  ]

  const projectAnalysisData = [
    { name: 'MoodSync+', complexity: 85, impact: 92, time: 120, satisfaction: 95 },
    { name: 'Car Simulation', complexity: 90, impact: 88, time: 150, satisfaction: 90 },
    { name: 'Sentiment Analysis', complexity: 75, impact: 85, time: 90, satisfaction: 88 },
    { name: 'Data Dashboard', complexity: 70, impact: 80, time: 75, satisfaction: 85 },
    { name: 'Cognitive Research', complexity: 95, impact: 95, time: 180, satisfaction: 98 },
    { name: 'Portfolio Website', complexity: 80, impact: 82, time: 100, satisfaction: 92 }
  ]

  const chartTypes = [
    { id: 'skills', name: 'Skills Proficiency', icon: '📊' },
    { id: 'progress', name: 'Progress Timeline', icon: '📈' },
    { id: 'experience', name: 'Experience Distribution', icon: '🥧' },
    { id: 'radar', name: 'Competency Analysis', icon: '🎯' },
    { id: 'evolution', name: 'Skill Evolution', icon: '🌊' },
    { id: 'projects', name: 'Project Analysis', icon: '🎲' }
  ]

  const renderChart = () => {
    switch (activeChart) {
      case 'skills':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="skill" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
              <Bar dataKey="proficiency" fill="url(#skillGradient)" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="learning" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
              <defs>
                <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        )

      case 'progress':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={projectImpactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
              <Area type="monotone" dataKey="productivity" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
              <Area type="monotone" dataKey="innovation" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'experience':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={experienceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {experienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Radar
                name="Current Level"
                dataKey="A"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Target Level"
                dataKey="B"
                stroke="#06B6D4"
                fill="#06B6D4"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </RadarChart>
          </ResponsiveContainer>
        )

      case 'evolution':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={skillEvolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
              <Line type="monotone" dataKey="Python" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }} />
              <Line type="monotone" dataKey="JavaScript" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }} />
              <Line type="monotone" dataKey="React" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }} />
              <Line type="monotone" dataKey="AI" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }} />
              <Line type="monotone" dataKey="AWS" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'projects':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={projectAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
              <Bar dataKey="complexity" fill="#8B5CF6" />
              <Bar dataKey="impact" fill="#06B6D4" />
              <Line type="monotone" dataKey="satisfaction" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <AnimatedBackground variant="subtle">
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Data <span className="gradient-text">Analytics</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Interactive data visualizations showcasing skills progression, project analytics, 
              and performance metrics derived from real development experience and research data.
            </p>
          </motion.div>

          {/* Chart Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {chartTypes.map((chart) => (
              <motion.button
                key={chart.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveChart(chart.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeChart === chart.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{chart.icon}</span>
                {chart.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Chart Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <div className="min-h-[400px]">
              {renderChart()}
            </div>
          </motion.div>

          {/* Data Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-6 mt-12"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">📈 Growth Rate</h3>
              <div className="text-3xl font-bold text-purple-400 mb-2">+15%</div>
              <p className="text-gray-300 text-sm">
                Monthly skill proficiency improvement across all technologies
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">🎯 Success Rate</h3>
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <p className="text-gray-300 text-sm">
                Project completion rate with measurable impact metrics
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">🔬 Research Impact</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">A+</div>
              <p className="text-gray-300 text-sm">
                Academic research excellence in cognitive science applications
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">⚡ Innovation Score</h3>
              <div className="text-3xl font-bold text-yellow-400 mb-2">92/100</div>
              <p className="text-gray-300 text-sm">
                Creative problem-solving and novel approach implementation
              </p>
            </div>
          </motion.div>

          {/* Interactive Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4">� Data Sources & Methodology</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">Skills Assessment</h4>
                <p>Based on project complexity, code reviews, and peer evaluations across multiple programming languages and frameworks.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Project Analytics</h4>
                <p>Derived from GitHub commits, issue resolution times, user feedback, and measurable performance improvements.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatedBackground>
  )
}
