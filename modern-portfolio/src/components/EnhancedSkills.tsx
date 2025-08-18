'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import resumeData from '@/data/resume.json'
import AnimatedBackground from './AnimatedBackground'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xpReward: number
  completed: boolean
  code?: string
  question?: string
  options?: string[]
  correctAnswer?: number
}

interface SkillWithProgress {
  name: string
  level: number
  xp: number
  maxXp: number
  challenges: Challenge[]
}

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [skillProgress, setSkillProgress] = useState<Record<string, SkillWithProgress>>({})

  // Initialize skill progress
  useEffect(() => {
    const initializeSkills = () => {
      const progress: Record<string, SkillWithProgress> = {}
      
      // Featured skills with challenges
      const featuredSkills = ['React', 'TypeScript', 'Python', 'Next.js', 'Node.js', 'TensorFlow']
      
      featuredSkills.forEach(skill => {
        progress[skill] = {
          name: skill,
          level: Math.floor(Math.random() * 3) + 6, // Level 6-8
          xp: Math.floor(Math.random() * 400) + 800,
          maxXp: 1200,
          challenges: generateChallenges(skill)
        }
      })
      
      setSkillProgress(progress)
    }
    
    initializeSkills()
  }, [])

  const generateChallenges = (skill: string): Challenge[] => {
    const challenges: Record<string, Challenge[]> = {
      'React': [
        {
          id: 'react-1',
          title: 'Component Lifecycle',
          description: 'Understanding useEffect dependencies',
          difficulty: 'intermediate',
          xpReward: 150,
          completed: false,
          code: `useEffect(() => {
  fetchUserData(userId)
}, [userId])`,
          question: 'What happens if we remove the dependency array?',
          options: ['Effect runs once', 'Effect runs on every render', 'Effect never runs', 'Compilation error'],
          correctAnswer: 1
        }
      ],
      'TypeScript': [
        {
          id: 'ts-1',
          title: 'Type Safety',
          description: 'Generic constraints and utility types',
          difficulty: 'advanced',
          xpReward: 200,
          completed: false,
          code: `type ApiResponse<T> = {
  data: T
  status: number
  message?: string
}`,
          question: 'What is the benefit of this generic type?',
          options: ['Reusability', 'Type safety', 'Better IntelliSense', 'All of the above'],
          correctAnswer: 3
        }
      ],
      'Python': [
        {
          id: 'py-1',
          title: 'Data Structures',
          description: 'Optimizing list operations',
          difficulty: 'intermediate',
          xpReward: 120,
          completed: false,
          code: `result = [x**2 for x in range(10) if x % 2 == 0]`,
          question: 'What does this list comprehension produce?',
          options: ['[0, 4, 16, 36, 64]', '[0, 2, 4, 6, 8]', '[1, 4, 9, 16, 25]', '[0, 1, 4, 9, 16]'],
          correctAnswer: 0
        }
      ]
    }
    
    return challenges[skill] || []
  }

  const skillCategories = [
    { 
      title: 'Programming Languages', 
      skills: resumeData.skills.languages,
      color: 'from-purple-500 to-blue-500'
    },
    { 
      title: 'AI/ML Tools', 
      skills: resumeData.skills.aiMlTools,
      color: 'from-pink-500 to-purple-500'
    },
    { 
      title: 'Frameworks', 
      skills: resumeData.skills.frameworks,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Databases', 
      skills: resumeData.skills.databases,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const handleChallengeComplete = (challengeId: string, correct: boolean) => {
    if (!selectedSkill || !currentChallenge) return

    setShowResult(true)
    
    if (correct) {
      setSkillProgress(prev => ({
        ...prev,
        [selectedSkill]: {
          ...prev[selectedSkill],
          xp: prev[selectedSkill].xp + currentChallenge.xpReward,
          challenges: prev[selectedSkill].challenges.map(c => 
            c.id === challengeId ? { ...c, completed: true } : c
          )
        }
      }))
    }
    
    setTimeout(() => {
      setShowResult(false)
      setCurrentChallenge(null)
      setSelectedAnswer(null)
    }, 2000)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentChallenge) return
    
    const correct = selectedAnswer === currentChallenge.correctAnswer
    handleChallengeComplete(currentChallenge.id, correct)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20'
      case 'advanced': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <AnimatedBackground variant="particles">
      <section className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Technical Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore my skills through interactive challenges and real-world applications
          </p>
        </motion.div>

        {!currentChallenge ? (
          <>
            {/* Featured Interactive Skills */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-center mb-8 text-purple-400">
                Interactive Skill Challenges
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(skillProgress).map(([skillName, skill]) => (
                  <motion.div
                    key={skillName}
                    className="glass p-6 rounded-xl cursor-pointer hover-lift"
                    onClick={() => setSelectedSkill(skillName)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-white">{skillName}</h4>
                      <span className="text-sm text-purple-400">Level {skill.level}</span>
                    </div>
                    
                    {/* XP Progress Bar */}
                    <div className="bg-gray-700 rounded-full h-2 mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{skill.xp} XP</span>
                      <span>{skill.challenges.filter(c => !c.completed).length} challenges</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Challenge Preview */}
            {Object.keys(skillProgress).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">
                  Sample Challenge Preview
                </h3>
                <div className="max-w-4xl mx-auto glass p-8 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* React Challenge Preview */}
                    {skillProgress['React'] && skillProgress['React'].challenges[0] && (
                      <div className="border border-purple-500/30 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">React Challenge</h4>
                            <p className="text-purple-400 text-sm">{skillProgress['React'].challenges[0].title}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(skillProgress['React'].challenges[0].difficulty)}`}>
                            {skillProgress['React'].challenges[0].difficulty}
                          </span>
                        </div>
                        
                        <div className="bg-gray-900 rounded-lg p-4 mb-4">
                          <pre className="text-green-400 text-sm overflow-x-auto">
                            <code>{skillProgress['React'].challenges[0].code}</code>
                          </pre>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-white text-sm mb-3">{skillProgress['React'].challenges[0].question}</p>
                          <div className="space-y-2">
                            {skillProgress['React'].challenges[0].options?.slice(0, 2).map((option, index) => (
                              <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3">
                                <span className="text-purple-400 font-mono text-sm">{String.fromCharCode(65 + index)}.</span>
                                <span className="text-white text-sm ml-2">{option}</span>
                              </div>
                            ))}
                            <div className="text-gray-400 text-sm text-center py-2">
                              ... and {(skillProgress['React'].challenges[0].options?.length || 0) - 2} more options
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 text-sm">+{skillProgress['React'].challenges[0].xpReward} XP</span>
                          <span className="text-purple-400 text-sm">Click skill above to try!</span>
                        </div>
                      </div>
                    )}

                    {/* TypeScript Challenge Preview */}
                    {skillProgress['TypeScript'] && skillProgress['TypeScript'].challenges[0] && (
                      <div className="border border-blue-500/30 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">TypeScript Challenge</h4>
                            <p className="text-blue-400 text-sm">{skillProgress['TypeScript'].challenges[0].title}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(skillProgress['TypeScript'].challenges[0].difficulty)}`}>
                            {skillProgress['TypeScript'].challenges[0].difficulty}
                          </span>
                        </div>
                        
                        <div className="bg-gray-900 rounded-lg p-4 mb-4">
                          <pre className="text-blue-400 text-sm overflow-x-auto">
                            <code>{skillProgress['TypeScript'].challenges[0].code}</code>
                          </pre>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-white text-sm mb-3">{skillProgress['TypeScript'].challenges[0].question}</p>
                          <div className="space-y-2">
                            {skillProgress['TypeScript'].challenges[0].options?.slice(0, 2).map((option, index) => (
                              <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3">
                                <span className="text-blue-400 font-mono text-sm">{String.fromCharCode(65 + index)}.</span>
                                <span className="text-white text-sm ml-2">{option}</span>
                              </div>
                            ))}
                            <div className="text-gray-400 text-sm text-center py-2">
                              ... and {(skillProgress['TypeScript'].challenges[0].options?.length || 0) - 2} more options
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 text-sm">+{skillProgress['TypeScript'].challenges[0].xpReward} XP</span>
                          <span className="text-blue-400 text-sm">Click skill above to try!</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Skills Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {skillCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                  viewport={{ once: true }}
                  className="glass p-8 rounded-xl hover-lift"
                >
                  <h3 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                    {category.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {category.skills.map((skill, skillIndex) => {
                      const hasProgress = skillProgress[skill]
                      return (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: categoryIndex * 0.2 + skillIndex * 0.1 
                          }}
                          whileHover={{ 
                            scale: 1.05, 
                            rotateY: 5,
                            boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)"
                          }}
                          viewport={{ once: true }}
                          className={`glass p-4 rounded-lg text-center hover-lift cursor-pointer relative ${
                            hasProgress ? 'border border-purple-500/30' : ''
                          }`}
                          onClick={() => hasProgress && setSelectedSkill(skill)}
                        >
                          <span className="text-sm font-medium">{skill}</span>
                          {hasProgress && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Skill Challenges */}
            <AnimatePresence>
              {selectedSkill && skillProgress[selectedSkill] && (
                <motion.div
                  className="glass p-8 rounded-xl mb-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedSkill}</h3>
                      <p className="text-gray-400">
                        Level {skillProgress[selectedSkill].level} • {skillProgress[selectedSkill].xp} XP
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSkill(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {skillProgress[selectedSkill].challenges.map((challenge) => (
                      <motion.div
                        key={challenge.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          challenge.completed
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-white/5 border-white/20 hover:border-purple-500/50'
                        }`}
                        onClick={() => !challenge.completed && setCurrentChallenge(challenge)}
                        whileHover={!challenge.completed ? { scale: 1.02 } : {}}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-white">{challenge.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 text-sm">+{challenge.xpReward} XP</span>
                          {challenge.completed && (
                            <span className="text-green-400 text-sm flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Completed
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Certifications & Awards */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
                Certifications & Achievements
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h4 className="text-xl font-bold mb-4 text-purple-400">Certifications</h4>
                  <ul className="space-y-2">
                    {resumeData.certifications.map((cert, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-sm leading-relaxed flex items-center"
                      >
                        <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {cert}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="glass p-6 rounded-xl">
                  <h4 className="text-xl font-bold mb-4 text-pink-400">Awards</h4>
                  <ul className="space-y-2">
                    {resumeData.awards.map((award, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-sm leading-relaxed flex items-center"
                      >
                        <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {award}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          /* Challenge Interface */
          <motion.div
            className="max-w-4xl mx-auto glass p-8 rounded-xl mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{currentChallenge.title}</h3>
                <p className="text-gray-300">{currentChallenge.description}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold">+{currentChallenge.xpReward} XP</div>
                <div className={`text-sm px-2 py-1 rounded ${getDifficultyColor(currentChallenge.difficulty)}`}>
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
              <h4 className="text-lg font-semibold text-white mb-4">{currentChallenge.question}</h4>
              <div className="space-y-3">
                {currentChallenge.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedAnswer(index)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="text-purple-400 font-mono">{String.fromCharCode(65 + index)}.</span>
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
                Back
              </button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  className={`mt-6 p-4 rounded-xl border ${
                    selectedAnswer === currentChallenge.correctAnswer
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-red-500/20 border-red-500/50 text-red-400'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {selectedAnswer === currentChallenge.correctAnswer ? '✓' : '✗'}
                    </div>
                    <div className="text-xl font-bold mb-2">
                      {selectedAnswer === currentChallenge.correctAnswer ? 'Correct!' : 'Incorrect!'}
                    </div>
                    {selectedAnswer === currentChallenge.correctAnswer && (
                      <div className="text-yellow-400">+{currentChallenge.xpReward} XP earned!</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </AnimatedBackground>
  )
}
