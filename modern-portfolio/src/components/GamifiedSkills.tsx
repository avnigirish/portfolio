'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'ai' | 'tools'
  level: number
  xp: number
  maxXp: number
  icon: string
  color: string
  challenges: Challenge[]
  achievements: Achievement[]
}

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  completed: boolean
  code?: string
  question?: string
  options?: string[]
  correctAnswer?: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

const SKILLS_DATA: Skill[] = [
  {
    id: 'react',
    name: 'React/Next.js',
    category: 'frontend',
    level: 8,
    xp: 2400,
    maxXp: 3000,
    icon: '⚛️',
    color: '#61dafb',
    challenges: [
      {
        id: 'react-1',
        title: 'Component Lifecycle',
        description: 'Complete this useEffect hook',
        difficulty: 'medium',
        xpReward: 150,
        completed: false,
        code: `useEffect(() => {
  // Fetch data on mount
  const fetchData = async () => {
    const response = await fetch('/api/data')
    const data = await response.json()
    setData(data)
  }
  
  fetchData()
  
  // What should go here?
}, [])`,
        question: 'What should be returned from this useEffect?',
        options: ['Nothing', 'A cleanup function', 'The data', 'A promise'],
        correctAnswer: 1
      },
      {
        id: 'react-2',
        title: 'State Management',
        description: 'Optimize this component re-rendering',
        difficulty: 'hard',
        xpReward: 250,
        completed: false,
        code: `const ExpensiveComponent = ({ items, filter }) => {
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  return (
    <div>
      {filteredItems.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  )
}`,
        question: 'How would you optimize this component?',
        options: ['Use useState', 'Use useMemo', 'Use useCallback', 'Use useRef'],
        correctAnswer: 1
      }
    ],
    achievements: [
      {
        id: 'react-master',
        title: 'React Master',
        description: 'Complete all React challenges',
        icon: '🏆',
        unlocked: false
      }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    level: 7,
    xp: 1800,
    maxXp: 2500,
    icon: '🔷',
    color: '#3178c6',
    challenges: [
      {
        id: 'ts-1',
        title: 'Generic Types',
        description: 'Define a generic function',
        difficulty: 'medium',
        xpReward: 200,
        completed: false,
        code: `// Create a generic function that returns the first element of an array
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0]
}

// Usage:
const numbers = [1, 2, 3]
const strings = ['a', 'b', 'c']

const firstNumber = getFirst(numbers) // Should be number | undefined
const firstString = getFirst(strings) // Should be string | undefined`,
        question: 'What is the benefit of using generics here?',
        options: ['Type safety', 'Better performance', 'Smaller bundle', 'Runtime validation'],
        correctAnswer: 0
      }
    ],
    achievements: [
      {
        id: 'type-safe',
        title: 'Type Safe',
        description: 'Master TypeScript generics',
        icon: '🛡️',
        unlocked: false
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI Integration',
    category: 'ai',
    level: 9,
    xp: 3200,
    maxXp: 3500,
    icon: '🤖',
    color: '#ff6b6b',
    challenges: [
      {
        id: 'ai-1',
        title: 'Prompt Engineering',
        description: 'Optimize this AI prompt',
        difficulty: 'hard',
        xpReward: 300,
        completed: false,
        code: `const prompt = "Write code"`,
        question: 'How would you improve this prompt for better AI responses?',
        options: [
          'Add context and examples',
          'Make it shorter',
          'Use more technical terms',
          'Add emojis'
        ],
        correctAnswer: 0
      }
    ],
    achievements: [
      {
        id: 'ai-whisperer',
        title: 'AI Whisperer',
        description: 'Master AI integration',
        icon: '🔮',
        unlocked: false
      }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    level: 6,
    xp: 1500,
    maxXp: 2000,
    icon: '🐍',
    color: '#3776ab',
    challenges: [
      {
        id: 'python-1',
        title: 'List Comprehensions',
        description: 'Optimize this code with list comprehension',
        difficulty: 'easy',
        xpReward: 100,
        completed: false,
        code: `# Convert this loop to a list comprehension
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = []
for num in numbers:
    if num % 2 == 0:
        even_squares.append(num ** 2)`,
        question: 'What is the list comprehension equivalent?',
        options: [
          '[num ** 2 for num in numbers if num % 2 == 0]',
          '[num for num in numbers if num ** 2 % 2 == 0]',
          '[num ** 2 if num % 2 == 0 for num in numbers]',
          '[num in numbers for num ** 2 if num % 2 == 0]'
        ],
        correctAnswer: 0
      }
    ],
    achievements: [
      {
        id: 'pythonic',
        title: 'Pythonic',
        description: 'Write clean Python code',
        icon: '✨',
        unlocked: false
      }
    ]
  }
]

export default function GamifiedSkills() {
  const [skills, setSkills] = useState<Skill[]>(SKILLS_DATA)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const total = skills.reduce((sum, skill) => sum + skill.xp, 0)
    setTotalXP(total)
  }, [skills])

  const handleChallengeComplete = (challengeId: string, correct: boolean) => {
    if (!selectedSkill || !currentChallenge) return

    setShowResult(true)
    
    if (correct) {
      // Update skill XP and challenge completion
      setSkills(prev => prev.map(skill => {
        if (skill.id === selectedSkill.id) {
          const updatedChallenges = skill.challenges.map(challenge => 
            challenge.id === challengeId 
              ? { ...challenge, completed: true }
              : challenge
          )
          
          const newXP = skill.xp + currentChallenge.xpReward
          const newLevel = Math.floor(newXP / 300) + 1
          
          return {
            ...skill,
            xp: newXP,
            level: newLevel,
            challenges: updatedChallenges
          }
        }
        return skill
      }))
      
      setStreak(prev => prev + 1)
      
      // Trigger confetti effect
      if (confettiRef.current) {
        const confetti = Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded"
            initial={{
              x: Math.random() * 400,
              y: 0,
              rotate: 0,
              scale: 1
            }}
            animate={{
              y: 400,
              rotate: 360,
              scale: 0
            }}
            transition={{
              duration: 2,
              delay: i * 0.1
            }}
          />
        ))
        
        // Add confetti elements temporarily
        setTimeout(() => {
          setShowResult(false)
          setCurrentChallenge(null)
          setSelectedAnswer(null)
        }, 2000)
      }
    } else {
      setStreak(0)
      setTimeout(() => {
        setShowResult(false)
        setSelectedAnswer(null)
      }, 2000)
    }
  }

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentChallenge) return
    
    const correct = selectedAnswer === currentChallenge.correctAnswer
    handleChallengeComplete(currentChallenge.id, correct)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend': return 'from-blue-500 to-purple-600'
      case 'backend': return 'from-green-500 to-teal-600'
      case 'ai': return 'from-pink-500 to-red-600'
      case 'tools': return 'from-yellow-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          className="text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎮 Skills Arcade
        </motion.h1>
        <div className="flex justify-center gap-8 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{totalXP.toLocaleString()}</div>
            <div className="text-sm opacity-60">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{streak}</div>
            <div className="text-sm opacity-60">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {skills.reduce((total, skill) => 
                total + skill.achievements.filter(a => a.unlocked).length, 0
              )}
            </div>
            <div className="text-sm opacity-60">Achievements</div>
          </div>
        </div>
      </div>

      {!currentChallenge ? (
        <>
          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                className={`bg-gradient-to-br ${getCategoryColor(skill.category)} p-6 rounded-2xl cursor-pointer transform hover:scale-105 transition-all`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedSkill(skill)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-3">{skill.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
                <div className="text-white/80 mb-4">Level {skill.level}</div>
                
                {/* XP Progress Bar */}
                <div className="bg-black/30 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-white rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
                
                <div className="text-xs text-white/60">
                  {skill.xp} / {skill.maxXp} XP
                </div>
                
                {/* Challenges Count */}
                <div className="mt-3 text-sm text-white/80">
                  {skill.challenges.filter(c => !c.completed).length} challenges available
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Skill Details */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedSkill.icon} {selectedSkill.name}
                    </h2>
                    <p className="text-white/60">
                      Level {selectedSkill.level} • {selectedSkill.xp} XP
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-white/60 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {selectedSkill.challenges.map((challenge) => (
                    <motion.div
                      key={challenge.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        challenge.completed
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-white/5 border-white/20 hover:border-purple-500/50'
                      }`}
                      onClick={() => !challenge.completed && startChallenge(challenge)}
                      whileHover={!challenge.completed ? { scale: 1.02 } : {}}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {challenge.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-3">
                        {challenge.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 text-sm">
                          +{challenge.xpReward} XP
                        </span>
                        {challenge.completed && (
                          <span className="text-green-400 text-sm">✓ Completed</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedSkill.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl ${
                          achievement.unlocked
                            ? 'bg-yellow-500/20 border-yellow-500/50'
                            : 'bg-gray-500/20 border-gray-500/50'
                        } border-2`}
                      >
                        <div className="text-2xl mb-2">{achievement.icon}</div>
                        <h4 className="font-semibold text-white mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-white/60 text-sm">
                          {achievement.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Challenge Interface */
        <motion.div
          className="max-w-4xl mx-auto bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentChallenge.title}
              </h2>
              <p className="text-white/70">{currentChallenge.description}</p>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold">
                +{currentChallenge.xpReward} XP
              </div>
              <div className={`text-sm px-2 py-1 rounded ${
                currentChallenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                currentChallenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {currentChallenge.difficulty}
              </div>
            </div>
          </div>

          {/* Code Block */}
          {currentChallenge.code && (
            <div className="bg-gray-900 rounded-xl p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{currentChallenge.code}</code>
              </pre>
            </div>
          )}

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {currentChallenge.question}
            </h3>

            <div className="space-y-3">
              {currentChallenge.options?.map((option, index) => (
                <motion.button
                  key={index}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === index
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-purple-500/50'
                  }`}
                  onClick={() => setSelectedAnswer(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-mono">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-white ml-3">{option}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <motion.button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                selectedAnswer !== null
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedAnswer !== null ? { scale: 1.05 } : {}}
              whileTap={selectedAnswer !== null ? { scale: 0.95 } : {}}
            >
              Submit Answer
            </motion.button>
            
            <button
              onClick={() => setCurrentChallenge(null)}
              className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              Back to Skills
            </button>
          </div>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                className={`mt-6 p-4 rounded-xl ${
                  selectedAnswer === currentChallenge.correctAnswer
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-red-500/20 border-red-500/50'
                } border-2`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {selectedAnswer === currentChallenge.correctAnswer ? '🎉' : '❌'}
                  </div>
                  <div className="text-xl font-bold text-white mb-2">
                    {selectedAnswer === currentChallenge.correctAnswer 
                      ? 'Correct!' 
                      : 'Incorrect!'
                    }
                  </div>
                  {selectedAnswer === currentChallenge.correctAnswer && (
                    <div className="text-yellow-400">
                      +{currentChallenge.xpReward} XP earned!
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confetti Container */}
          <div ref={confettiRef} className="fixed inset-0 pointer-events-none overflow-hidden" />
        </motion.div>
      )}
    </div>
  )
}
