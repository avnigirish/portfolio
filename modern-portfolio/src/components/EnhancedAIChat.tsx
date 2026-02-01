'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  structured?: any
  voiceEnabled?: boolean
}

interface VoiceSettings {
  enabled: boolean
  rate: number
  pitch: number
  volume: number
  voice: string
}

export default function EnhancedAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voice: 'default'
  })
  const [recognition, setRecognition] = useState<any>(null)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'en-US'

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }

        recognitionInstance.onerror = () => {
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }

      // Speech Synthesis
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis
        setSynthesis(synth)

        const updateVoices = () => {
          const voices = synth.getVoices()
          setAvailableVoices(voices)
        }

        updateVoices()
        synth.onvoiceschanged = updateVoices
      }
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const speakMessage = (text: string) => {
    if (synthesis && voiceSettings.enabled) {
      synthesis.cancel() // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume

      // Use selected voice
      const selectedVoice = availableVoices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Alex')
      )
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      synthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel()
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputValue,
          context: "You are Avni Girish's enhanced AI assistant with voice capabilities. Provide engaging, informative responses about her background, skills, and experience. Keep responses conversational and under 200 words for voice synthesis."
        })
      })

      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'bot',
        timestamp: new Date(),
        structured: data.structured,
        voiceEnabled: true
      }

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
        
        // Auto-speak bot response if voice is enabled
        if (voiceSettings.enabled) {
          setTimeout(() => speakMessage(data.message), 500)
        }
      }, 1500)

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { text: "Tell me about Avni's experience", icon: <Sparkles className="w-4 h-4" /> },
    { text: "What are her technical skills?", icon: <Brain className="w-4 h-4" /> },
    { text: "Show me her projects", icon: <Zap className="w-4 h-4" /> },
    { text: "How can I contact her?", icon: <MessageCircle className="w-4 h-4" /> }
  ]

  return (
    <>
      {/* Enhanced Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : 'flex'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.3)",
            "0 0 40px rgba(139, 92, 246, 0.6)",
            "0 0 20px rgba(139, 92, 246, 0.3)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-2xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.button>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Avni's AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Enhanced with voice</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Voice Controls */}
                <motion.button
                  onClick={() => setVoiceSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg transition-colors ${
                    voiceSettings.enabled 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {voiceSettings.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </motion.button>
                
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <p className="text-lg font-medium mb-2">Hi! I'm Avni's AI Assistant</p>
                  <p className="text-sm mb-4">Ask me anything about her experience, skills, or projects!</p>
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setInputValue(action.text)}
                        whileHover={{ scale: 1.02 }}
                        className="w-full p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {action.icon}
                        <span className="text-sm">{action.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.sender === 'user' ? 
                        <User className="w-4 h-4 text-white" /> : 
                        <Bot className="w-4 h-4 text-white" />
                      }
                    </div>
                    
                    <div className={`rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-muted text-foreground border border-border'
                    }`}>
                      {message.sender === 'bot' ? (
                        <div className="space-y-2">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          {message.voiceEnabled && (
                            <div className="flex items-center space-x-2 mt-2">
                              <motion.button
                                onClick={() => speakMessage(message.content)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 hover:bg-purple-500/20 rounded text-purple-500"
                              >
                                <Volume2 className="w-3 h-3" />
                              </motion.button>
                              <motion.button
                                onClick={stopSpeaking}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 hover:bg-red-500/20 rounded text-red-500"
                              >
                                <VolumeX className="w-3 h-3" />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
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
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-2xl p-3 border border-border">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about Avni..."
                    className="w-full p-3 pr-12 bg-muted border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    rows={1}
                  />
                  
                  {/* Voice Input Button */}
                  <motion.button
                    onClick={isListening ? stopListening : startListening}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              
              {isListening && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-purple-500 mt-2 flex items-center"
                >
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full mr-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  Listening... Speak now!
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
