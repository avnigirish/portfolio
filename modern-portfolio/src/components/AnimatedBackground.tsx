'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'subtle' | 'particles' | 'grid' | 'hero' | 'about' | 'experience' | 'skills' | 'projects' | 'contact'
  children: React.ReactNode
}

export default function AnimatedBackground({ variant = 'default', children }: AnimatedBackgroundProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getParticleCount = () => {
    switch (variant) {
      case 'subtle': return 20
      case 'particles': return 80
      case 'grid': return 30
      case 'hero': return 60
      case 'about': return 40
      case 'skills': return 50
      default: return 50
    }
  }

  const getOpacity = () => {
    switch (variant) {
      case 'subtle': return 'opacity-5'
      case 'particles': return 'opacity-10'
      case 'grid': return 'opacity-15'
      case 'hero': return 'opacity-20'
      case 'about': return 'opacity-8'
      case 'skills': return 'opacity-12'
      default: return 'opacity-10'
    }
  }

  const renderHeroBackground = () => (
    <>
      {/* Animated gradient waves */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 360],
          x: [0, 100, -50, 0],
          y: [0, -50, 25, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.4, 1.2],
          rotate: [0, -180, -360],
          x: [0, -80, 40, 0],
          y: [0, 60, -30, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-full blur-3xl"
      />

      {/* Floating geometric shapes */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
          initial={{
            x: (i * 100) % 800,
            y: (i * 80) % 600,
          }}
          animate={{
            x: ((i * 100) + 300) % 800,
            y: ((i * 80) + 200) % 600,
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 15 + (i % 5),
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </>
  )

  const renderAboutBackground = () => (
    <>
      {/* Neural network-like connections */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={i}
            x1={`${(i * 15) % 100}%`}
            y1={`${(i * 20) % 100}%`}
            x2={`${((i * 15) + 40) % 100}%`}
            y2={`${((i * 20) + 30) % 100}%`}
            stroke="url(#gradient-about)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating brain-like nodes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          initial={{
            x: (i * 120) % 800,
            y: (i * 90) % 500,
          }}
          animate={{
            y: [((i * 90) % 500), ((i * 90) % 500) - 50, ((i * 90) % 500)],
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.9, 0.3]
          }}
          transition={{
            duration: 8 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )

  const renderExperienceBackground = () => (
    <>
      {/* Timeline-inspired flowing lines */}
      <svg className="absolute inset-0 w-full h-full opacity-8">
        <motion.path
          d="M0,50 Q300,20 600,50 T1200,50"
          stroke="url(#gradient-experience)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M0,150 Q400,120 800,150 T1600,150"
          stroke="url(#gradient-experience-2)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1
          }}
        />
        <defs>
          <linearGradient id="gradient-experience" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient-experience-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Progress indicators */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 border-2 border-purple-400/40 rounded-full"
          initial={{
            x: (i * 180) + 50,
            y: 45,
            scale: 0
          }}
          animate={{
            scale: [0, 1, 0],
            borderColor: ["rgba(139, 92, 246, 0.4)", "rgba(139, 92, 246, 0.8)", "rgba(139, 92, 246, 0.4)"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )

  const renderSkillsBackground = () => (
    <>
      {/* Code-like matrix effect */}
      <div className="absolute inset-0 font-mono text-xs">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/20 whitespace-nowrap"
            initial={{
              x: (i * 60) % 800,
              y: (i * 40) % 600,
              opacity: 0
            }}
            animate={{
              y: [((i * 40) % 600), ((i * 40) % 600) + 100],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 6 + (i % 3),
              repeat: Infinity,
              delay: (i % 8) * 0.5,
              ease: "linear"
            }}
          >
            {['const skill = "expert"', 'function code()', '=> AI.learn()', 'while(true) { improve(); }'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Skill network connections */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.circle
            key={i}
            cx={`${(i * 25) % 80 + 10}%`}
            cy={`${(i * 30) % 70 + 15}%`}
            r="2"
            fill="url(#gradient-skills)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
        <defs>
          <radialGradient id="gradient-skills">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </radialGradient>
        </defs>
      </svg>
    </>
  )

  const renderProjectsBackground = () => (
    <>
      {/* Project tiles floating effect */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-purple-400/20 rounded-lg"
          initial={{
            x: (i * 90) % 800,
            y: (i * 70) % 500,
            width: 40 + (i % 3) * 20,
            height: 30 + (i % 2) * 15,
            rotate: 0,
            opacity: 0.1
          }}
          animate={{
            rotate: [0, 5, -5, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 6) * 0.8
          }}
        />
      ))}

      {/* Data flow streams */}
      <svg className="absolute inset-0 w-full h-full opacity-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M${i * 300},600 Q${i * 300 + 150},300 ${i * 300 + 300},0`}
            stroke="url(#gradient-projects)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.2
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient-projects" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </>
  )

  const renderContactBackground = () => (
    <>
      {/* Communication waves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-purple-400/20 rounded-full"
          initial={{
            x: '50%',
            y: '50%',
            width: 50 + i * 40,
            height: 50 + i * 40,
            opacity: 0.5
          }}
          animate={{
            width: [50 + i * 40, 100 + i * 60, 50 + i * 40],
            height: [50 + i * 40, 100 + i * 60, 50 + i * 40],
            opacity: [0.5, 0.1, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
          style={{
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Message dots */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-pink-400/40 rounded-full"
          initial={{
            x: (i * 110) % 800,
            y: (i * 80) % 500,
          }}
          animate={{
            y: [((i * 80) % 500), ((i * 80) % 500) - 100, ((i * 80) % 500)],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 6 + (i % 3),
            repeat: Infinity,
            delay: (i % 5) * 0.6,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )

  const renderSpecificBackground = () => {
    switch (variant) {
      case 'hero':
        return renderHeroBackground()
      case 'about':
        return renderAboutBackground()
      case 'experience':
        return renderExperienceBackground()
      case 'skills':
        return renderSkillsBackground()
      case 'projects':
        return renderProjectsBackground()
      case 'contact':
        return renderContactBackground()
      default:
        return null
    }
  }

  return (
    <div className="relative">
      {/* Component-specific animated background */}
      <div className={`absolute inset-0 overflow-hidden ${getOpacity()}`}>
        {isClient && renderSpecificBackground()}
        
        {/* Fallback to original backgrounds for other variants */}
        {isClient && !['hero', 'about', 'experience', 'skills', 'projects', 'contact'].includes(variant) && (
          <>
            {/* Floating Particles */}
            {Array.from({ length: getParticleCount() }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                initial={{
                  x: (i * 73) % 800,
                  y: (i * 97) % 600,
                }}
                animate={{
                  x: ((i * 73) + 200) % 800,
                  y: ((i * 97) + 150) % 600,
                }}
                transition={{
                  duration: 30 + (i % 10),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}

            {/* Gradient Orbs */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
                x: [0, 100, 0],
                y: [0, -50, 0]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            />
            
            <motion.div
              animate={{
                scale: [1.3, 1, 1.3],
                rotate: [360, 180, 0],
                x: [0, -100, 0],
                y: [0, 50, 0]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            />

            {/* Geometric Shapes */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-purple-400/20 rounded-lg"
                style={{
                  left: `${(i * 150) % 800}px`,
                  top: `${(i * 120) % 500}px`,
                  width: `${20 + (i % 3) * 10}px`,
                  height: `${20 + (i % 3) * 10}px`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 20 + (i % 5),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}

            {/* Matrix Grid Effect */}
            {variant === 'grid' && (
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-16 grid-rows-12 h-full w-full">
                  {Array.from({ length: 192 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: (i % 40) * 0.2
                      }}
                      className="border border-purple-500/10"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Floating Code Elements */}
            {variant === 'default' && (
              <div className="absolute inset-0 font-mono text-xs">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-purple-400/20 whitespace-nowrap"
                    initial={{
                      x: (i * 100) % 800,
                      y: (i * 80) % 500,
                      opacity: 0
                    }}
                    animate={{
                      y: [((i * 80) % 500), ((i * 80) % 500) + 200],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 10 + (i % 5),
                      repeat: Infinity,
                      delay: (i % 6) * 0.8,
                      ease: "linear"
                    }}
                  >
                    {['{ }', '< />', '( )', '[ ]', '=> ', '...', '?.', '!!', '||', '&&'][i % 10]}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}