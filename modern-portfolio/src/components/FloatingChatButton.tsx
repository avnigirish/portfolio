'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  structured?: {
    topic: string
    description: string
    key_points: string[]
    career_insights?: string[]
    related_areas?: string[]
  }
}

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Avni's AI assistant. I can provide deep insights into her background, career trajectory, and how her unique CS + Cognitive Science combination positions her for exciting opportunities. What would you like to explore?",
      sender: 'bot',
      timestamp: new Date(),
      structured: {
        topic: "Intelligent Assistant",
        description: "AI-powered insights into Avni's profile and career potential",
        key_points: [
          "Deep analysis of technical and research background",
          "Career trajectory insights based on experience pattern",
          "Strategic positioning for AI/ML and interdisciplinary roles",
          "Comprehensive understanding of her unique value proposition"
        ],
        career_insights: [
          "Perfect positioning for AI Research Scientist roles",
          "Ideal candidate for FinTech AI/ML positions",
          "Strong potential for PhD programs in Human-AI Interaction",
          "Excellent fit for Product Management in AI/UX companies"
        ]
      }
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const portfolioContext = `
        Portfolio Context for AI Assistant:
        
        Avni Girish is a Computer Science and Cognitive Science student at Rutgers University with a unique interdisciplinary background that positions her exceptionally well for the future of AI and human-computer interaction.
        
        Her profile represents the convergence of technical excellence and human-centered understanding - exactly what's needed as AI becomes more integrated into society. The combination of her financial sector experience (BNY), government consulting (NJEDA), and academic research creates a rare profile that understands technology from multiple stakeholder perspectives.
        
        Key differentiators:
        - Technical depth in AI/ML with real-world application experience
        - Cognitive science research providing user psychology insights
        - Cross-sector exposure (finance, government, academia)
        - Strong academic performance (3.6 GPA) with practical project portfolio
        - Leadership in diversity initiatives showing social impact awareness
        
        This profile suggests high potential for roles requiring both technical sophistication and human-centered design thinking.
      `

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: portfolioContext
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'bot',
          timestamp: new Date(),
          structured: data.structured
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing some technical difficulties right now. This could be due to model limitations or API issues. Please try again in a moment, or feel free to reach out to Avni directly at avni123.girish@gmail.com for immediate assistance.",
        sender: 'bot',
        timestamp: new Date(),
        structured: {
          topic: "Technical Issue",
          description: "Temporary service disruption",
          key_points: [
            "API service may be temporarily unavailable",
            "Contact information available for direct communication",
            "Please try again shortly"
          ]
        }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle size={24} />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, type: "spring" }}
          >
            AI
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-40 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">AI Career Assistant</h3>
                  <p className="text-sm opacity-90">Powered by advanced insights</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    
                    <div className={`rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="text-base font-bold mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-sm font-bold mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-xs font-bold mb-1">{children}</h3>,
                            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                            em: ({children}) => <em className="italic">{children}</em>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-xs">{children}</li>,
                            p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
                            code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-gray-300 pl-2 italic text-xs">{children}</blockquote>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      
                      {/* Structured Response Display */}
                      {message.structured && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                            📊 {message.structured.topic}
                          </div>
                          
                          {message.structured.career_insights && (
                            <div className="text-xs space-y-1">
                              <div className="font-semibold text-green-600">🚀 Career Insights:</div>
                              {message.structured.career_insights.map((insight, idx) => (
                                <div key={idx} className="text-green-700 bg-green-50 px-2 py-1 rounded text-xs">
                                  • {insight}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {message.structured.related_areas && (
                            <div className="text-xs">
                              <span className="font-semibold text-blue-600">🔗 Explore: </span>
                              <span className="text-blue-700">{message.structured.related_areas.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Avni's background..."
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-sm transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
