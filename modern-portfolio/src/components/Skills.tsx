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
      color: 'from-green-500 to-teal-500'
    },
    { 
      title: 'Developer Tools', 
      skills: resumeData.skills.tools,
      color: 'from-orange-500 to-red-500'
    },
    { 
      title: 'Cloud Services', 
      skills: ['AWS', 'Google Cloud', 'Vercel', 'Netlify'],
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  return (
    <AnimatedBackground>
      <section id="skills" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Skills & Expertise
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore my skills through interactive challenges and real-world applications
            </p>
          </motion.div>

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
                  {category.skills.map((skill: string, skillIndex: number) => {
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

          {/* Certifications & Awards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
              Certifications & Awards
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-4 text-blue-400">Certifications</h4>
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
        </div>
      </section>
    </AnimatedBackground>
  )
}
