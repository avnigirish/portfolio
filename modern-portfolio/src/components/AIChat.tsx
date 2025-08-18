'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AnimatedBackground from './AnimatedBackground'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  structured?: {
    topic: string
    description: string
    key_points: string[]
    related_areas?: string[]
  }
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Avni's AI assistant. Feel free to ask me about her background, experience, or anything else you'd like to know!",
      sender: 'bot',
      timestamp: new Date(),
      structured: {
        topic: "Introduction",
        description: "Welcome to Avni's AI-powered assistant",
        key_points: [
          "Ask about education and background",
          "Learn about work experience",
          "Explore technical skills and projects",
          "Discover research interests"
        ]
      }
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const structuredResponses: Record<string, any> = {
    'education': {
      topic: "Education & Academic Background",
      description: "Avni is pursuing her Bachelor's degree in Computer Science with a minor in Cognitive Science at Rutgers University",
      key_points: [
        "Computer Science & Cognitive Science Double Major",
        "3.7 GPA at Rutgers University-New Brunswick",
        "Expected graduation: December 2025",
        "Coursework in AI, Data Science, and Algorithms"
      ],
      related_areas: ["Research", "Academic Projects", "Organizations"]
    },
    'experience': {
      topic: "Professional Experience",
      description: "Diverse experience spanning software engineering, data science, and technical consulting",
      key_points: [
        "InfoSec Data Science Intern at BNY (2025)",
        "IT Business Analyst at NJEDA (2024)",
        "Research Assistant at Rutgers University",
        "Diversity programs at Morgan Stanley & Accenture"
      ],
      related_areas: ["Skills", "Projects", "AI Applications"]
    },
    'skills': {
      topic: "Technical Skills & Expertise",
      description: "Full-stack development, AI/ML, and data science capabilities",
      key_points: [
        "Languages: Python, Java, C++, JavaScript, SQL",
        "AI/ML: TensorFlow, PyTorch, NLP, Computer Vision",
        "Frameworks: React, Next.js, FastAPI, Node.js",
        "Cloud: AWS, Azure, Database technologies"
      ],
      related_areas: ["Projects", "Experience", "Certifications"]
    },
    'research': {
      topic: "Research & Academic Work",
      description: "Cognitive science research examining hunger's impact on decision-making",
      key_points: [
        "Working under Dr. Jenny Wang at Rutgers",
        "Studying cognitive components of numerical understanding",
        "Analyzing hunger effects on children's cognitive processes",
        "Using MATLAB and statistical analysis methods"
      ],
      related_areas: ["Education", "Data Science", "Publications"]
    },
    'projects': {
      topic: "Featured Projects & Applications",
      description: "AI-powered applications and innovative technical solutions",
      key_points: [
        "MoodSync+: AI wellness app with Spotify integration",
        "Automated Car Simulation with neural networks",
        "Sentiment analysis tools with 95% accuracy",
        "Real-time data visualization dashboards"
      ],
      related_areas: ["GitHub", "Skills", "Experience"]
    },
    'ai': {
      topic: "Artificial Intelligence Expertise",
      description: "Passionate about AI applications in cognitive science and real-world problems",
      key_points: [
        "Natural Language Processing and sentiment analysis",
        "Computer vision and neural network applications",
        "AI integration in web applications",
        "Research applications in cognitive science"
      ],
      related_areas: ["Projects", "Research", "Experience"]
    }
  }

  const getStructuredResponse = async (message: string): Promise<any> => {
    const lowerMessage = message.toLowerCase()
    
    // Check for keyword matches in structured responses
    for (const [keyword, response] of Object.entries(structuredResponses)) {
      if (lowerMessage.includes(keyword)) {
        return {
          content: `Here's what you should know about Avni's ${response.topic.toLowerCase()}:

${response.description}

Key highlights:
${response.key_points.map((point: string) => `• ${point}`).join('\n')}

${response.related_areas ? `\nRelated topics you might be interested in: ${response.related_areas.join(', ')}` : ''}`,
          structured: response
        }
      }
    }

    // Enhanced default responses with structured format
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return {
        content: `Here's how you can connect with Avni:

• Email: avni123.girish@gmail.com
• University: ag2327@scarletmail.rutgers.edu  
• Location: New Brunswick, NJ
• LinkedIn: Available through her portfolio
• Status: Open to opportunities and collaborations

She's always excited to discuss AI, software development, research opportunities, or potential collaborations!`,
        structured: {
          topic: "Contact Information",
          description: "Multiple ways to connect with Avni for opportunities and collaboration",
          key_points: [
            "Professional email available",
            "University contact provided",
            "Located in New Brunswick, NJ",
            "Active on professional networks",
            "Open to new opportunities"
          ]
        }
      }
    }

    // Try OpenRouter API if available
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message,
            context: "You are Avni Girish's AI assistant. Provide helpful information about her background, skills, and experience."
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          return {
            content: data.response,
            structured: data.structured || null
          }
        }
      } catch (error) {
        console.log('OpenRouter API not available, using fallback responses')
      }
    }
    
    // Default fallback response
    return {
      content: `I'd be happy to help you learn more about Avni! I can provide information about:

• Her education at Rutgers University
• Professional experience and internships  
• Technical skills and programming expertise
• Research work in cognitive science
• AI and data science projects
• Contact information and opportunities

What specific area would you like to know more about?`,
      structured: {
        topic: "Available Information",
        description: "Comprehensive information about Avni's background and expertise",
        key_points: [
          "Educational background and achievements",
          "Professional experience across multiple companies",
          "Technical skills in AI, ML, and full-stack development",
          "Research contributions in cognitive science",
          "Portfolio of innovative projects"
        ]
      }
    }
  }

  const handleSendMessage = async () => {
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

    // Simulate typing delay and get structured response
    setTimeout(async () => {
      const responseData = await getStructuredResponse(inputMessage)
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseData.content,
        sender: 'bot',
        timestamp: new Date(),
        structured: responseData.structured
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatedBackground variant="grid">
      <section className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
          AI Assistant
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Chat with my AI assistant to learn more about my background and experience
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass rounded-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Avni's AI Assistant</h3>
                <p className="text-white/80 text-sm">Ask me anything about Avni!</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-muted'
                  }`}>
                    <div className="text-sm leading-relaxed">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-3 italic">{children}</blockquote>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex max-w-xs lg:max-w-md space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-lg bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Avni's experience, skills, or projects..."
                className="flex-1 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                rows={1}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Quick Questions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['Education', 'Experience', 'Skills', 'Research', 'Projects'].map((topic) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInputMessage(`Tell me about ${topic.toLowerCase()}`)}
                  className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
    </AnimatedBackground>
  )
}
