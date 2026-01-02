'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'particles' | 'grid' | 'hero' | 'about' | 'experience' | 'skills' | 'projects' | 'contact';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children, variant = 'default' }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getOpacity = () => {
    switch (variant) {
      case 'hero':
        return 'opacity-50';
      case 'subtle':
        return 'opacity-20';
      case 'default':
        return 'opacity-30';
      default:
        return 'opacity-25';
    }
  }

  const getParticleCount = () => {
    switch (variant) {
      case 'hero':
        return 20; // Reduced from 60
      case 'particles':
        return 30; // Reduced from 80
      default:
        return 15; // Reduced from 40
    }
  }

  const renderHeroBackground = () => (
    <>
      {/* Simplified Gradient Waves */}
      <motion.div
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['-20%', '20%', '-20%'],
        }}
        transition={{
          duration: 40, // Slower
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: ['20%', '-20%', '20%'],
          y: ['20%', '-20%', '20%'],
        }}
        transition={{
          duration: 45, // Slower
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute -bottom-1/2 -right-1/2 w-[150%] h-[150%] bg-gradient-to-tl from-cyan-500/30 via-purple-500/30 to-indigo-500/30 rounded-full blur-3xl"
      />

      {/* Reduced Floating Geometric Shapes */}
      {Array.from({ length: 5 }).map((_, i) => { // Reduced from 15
        const size = 20 + (i % 3) * 15;
        return (
          <motion.div
            key={i}
            className="absolute border border-purple-400/30"
            style={{
              width: size,
              height: size,
              borderRadius: i % 2 === 0 ? '50%' : '8px',
            }}
            initial={{
              x: (i * 200) % 800,
              y: (i * 150) % 600,
            }}
            animate={{
              y: [(i * 150) % 600, ((i * 150) % 600) - 50, (i * 150) % 600],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 20 + (i * 5), // Slower
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </>
  )

  const renderParticlesBackground = () => (
    <>
      {/* Reduced Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => ( // Reduced from 80
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          initial={{
            x: (i * 100) % 800,
            y: (i * 80) % 600,
          }}
          animate={{
            x: ((i * 100) + 300) % 800,
            y: ((i * 80) + 200) % 600,
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 20 + (i % 5), // Slower
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </>
  )

  const renderAboutBackground = () => (
    <>
      {/* Simplified Neural network-like connections */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {Array.from({ length: 4 }).map((_, i) => ( // Reduced from 8
          <motion.line
            key={i}
            x1={`${(i * 25) % 100}%`}
            y1={`${(i * 30) % 100}%`}
            x2={`${((i * 25) + 40) % 100}%`}
            y2={`${((i * 30) + 30) % 100}%`}
            stroke="url(#gradient-about)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              duration: 8 + i, // Slower
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

      {/* Reduced Floating brain-like nodes */}
      {Array.from({ length: 5 }).map((_, i) => ( // Reduced from 12
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          initial={{
            x: (i * 180) % 800,
            y: (i * 120) % 500,
          }}
          animate={{
            y: [((i * 120) % 500), ((i * 120) % 500) - 30, ((i * 120) % 500)],
            opacity: [0.3, 0.9, 0.3]
          }}
          transition={{
            duration: 12 + (i % 4), // Slower
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )

  const renderExperienceBackground = () => (
    <>
      {/* Simplified Timeline-inspired flowing lines */}
      <svg className="absolute inset-0 w-full h-full opacity-8">
        <motion.path
          d="M0,50 Q300,20 600,50 T1200,50"
          stroke="url(#gradient-experience)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8, // Slower
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
            duration: 10, // Slower
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

      {/* Reduced Progress indicators */}
      {Array.from({ length: 4 }).map((_, i) => ( // Reduced from 6
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 border-2 border-purple-400/40 rounded-full"
          initial={{
            x: (i * 220) + 50,
            y: 45,
            scale: 0
          }}
          animate={{
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4, // Slower
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )

  const renderSkillsBackground = () => (
    <>
      {/* Reduced Code-like matrix effect */}
      <div className="absolute inset-0 font-mono text-xs">
        {Array.from({ length: 8 }).map((_, i) => ( // Reduced from 20
          <motion.div
            key={i}
            className="absolute text-purple-400/20 whitespace-nowrap"
            initial={{
              x: (i * 120) % 800,
              y: (i * 80) % 600,
              opacity: 0
            }}
            animate={{
              y: [((i * 80) % 600), ((i * 80) % 600) + 80],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 10 + (i % 3), // Slower
              repeat: Infinity,
              delay: (i % 4) * 0.8,
              ease: "linear"
            }}
          >
            {['const skill = "expert"', 'function code()', '=> AI.learn()', 'while(true) { improve(); }'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Reduced Skill network connections */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {Array.from({ length: 6 }).map((_, i) => ( // Reduced from 12
          <motion.circle
            key={i}
            cx={`${(i * 30) % 80 + 10}%`}
            cy={`${(i * 35) % 70 + 15}%`}
            r="2"
            fill="url(#gradient-skills)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 5, // Slower
              repeat: Infinity,
              delay: i * 0.5,
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
      {/* Reduced Project tiles floating effect */}
      {Array.from({ length: 6 }).map((_, i) => ( // Reduced from 16
        <motion.div
          key={i}
          className="absolute border border-purple-400/20 rounded-lg"
          initial={{
            x: (i * 150) % 800,
            y: (i * 100) % 500,
            width: 50 + (i % 3) * 20,
            height: 40 + (i % 2) * 15,
            opacity: 0.1
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [(i * 100) % 500, ((i * 100) % 500) - 20, (i * 100) % 500]
          }}
          transition={{
            duration: 12 + (i % 4), // Slower
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 3) * 1.2
          }}
        />
      ))}

      {/* Simplified Data flow streams */}
      <svg className="absolute inset-0 w-full h-full opacity-8">
        {Array.from({ length: 3 }).map((_, i) => ( // Reduced from 4
          <motion.path
            key={i}
            d={`M${i * 400},600 Q${i * 400 + 200},300 ${i * 400 + 400},0`}
            stroke="url(#gradient-projects)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 8, // Slower
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5
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
      {/* Simplified Communication waves */}
      {Array.from({ length: 4 }).map((_, i) => ( // Reduced from 6
        <motion.div
          key={i}
          className="absolute border border-purple-400/20 rounded-full"
          initial={{
            x: '50%',
            y: '50%',
            width: 50 + i * 50,
            height: 50 + i * 50,
            opacity: 0.5
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.1, 0.4]
          }}
          transition={{
            duration: 5, // Slower
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut"
          }}
          style={{
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Reduced Message dots */}
      {Array.from({ length: 5 }).map((_, i) => ( // Reduced from 10
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-pink-400/40 rounded-full"
          initial={{
            x: (i * 150) % 800,
            y: (i * 110) % 500,
          }}
          animate={{
            y: [((i * 110) % 500), ((i * 110) % 500) - 80, ((i * 110) % 500)],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 8 + (i % 3), // Slower
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
                  duration: 40 + (i % 10), // Slower
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}

            {/* Simplified Gradient Orbs */}
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0]
              }}
              transition={{
                duration: 35, // Slower
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            />
            
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0]
              }}
              transition={{
                duration: 40, // Slower
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            />

            {/* Reduced Geometric Shapes */}
            {Array.from({ length: 4 }).map((_, i) => ( // Reduced from 8
              <motion.div
                key={i}
                className="absolute border border-purple-400/20 rounded-lg"
                style={{
                  left: `${(i * 200) % 800}px`,
                  top: `${(i * 150) % 500}px`,
                  width: `${20 + (i % 3) * 10}px`,
                  height: `${20 + (i % 3) * 10}px`,
                }}
                animate={{
                  y: [`${(i * 150) % 500}px`, `${((i * 150) % 500) - 30}px`, `${(i * 150) % 500}px`],
                }}
                transition={{
                  duration: 25 + (i % 5), // Slower
                  repeat: Infinity,
                  ease: "easeInOut"
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
                        duration: 5, // Slower
                        repeat: Infinity,
                        delay: (i % 40) * 0.3
                      }}
                      className="border border-purple-500/10"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reduced Floating Code Elements */}
            {variant === 'default' && (
              <div className="absolute inset-0 font-mono text-xs">
                {Array.from({ length: 6 }).map((_, i) => ( // Reduced from 12
                  <motion.div
                    key={i}
                    className="absolute text-purple-400/20 whitespace-nowrap"
                    initial={{
                      x: (i * 150) % 800,
                      y: (i * 100) % 500,
                      opacity: 0
                    }}
                    animate={{
                      y: [((i * 100) % 500), ((i * 100) % 500) + 150],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 15 + (i % 5), // Slower
                      repeat: Infinity,
                      delay: (i % 6) * 1,
                      ease: "linear"
                    }}
                  >
                    {['{ }', '< />', '( )', '[ ]', '=> ', '...'][i % 6]}
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

export default AnimatedBackground;