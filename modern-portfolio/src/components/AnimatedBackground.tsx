'use client'

import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'subtle' | 'particles' | 'grid'
  children: React.ReactNode
}

export default function AnimatedBackground({ variant = 'default', children }: AnimatedBackgroundProps) {
  const getParticleCount = () => {
    switch (variant) {
      case 'subtle': return 20
      case 'particles': return 80
      case 'grid': return 30
      default: return 50
    }
  }

  const getOpacity = () => {
    switch (variant) {
      case 'subtle': return 'opacity-5'
      case 'particles': return 'opacity-10'
      case 'grid': return 'opacity-15'
      default: return 'opacity-10'
    }
  }

  return (
    <div className="relative">
      {/* Animated Background */}
      <div className={`absolute inset-0 overflow-hidden ${getOpacity()}`}>
        {/* Floating Particles */}
        {Array.from({ length: getParticleCount() }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{
              x: (i * 73) % 1200, // Deterministic positioning
              y: (i * 97) % 800,
            }}
            animate={{
              x: ((i * 73) + 200) % 1200,
              y: ((i * 97) + 150) % 800,
            }}
            transition={{
              duration: 30 + (i % 10), // Deterministic duration
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
        <motion.div
          animate={{
            rotateZ: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/5 w-3 h-3 bg-gradient-to-br from-purple-400/40 to-pink-400/40 transform rotate-45"
        />
        
        <motion.div
          animate={{
            rotateX: [0, 360],
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full"
        />

        {/* Additional Shapes for Variety */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-2/3 left-1/3 w-2 h-2 bg-gradient-to-br from-pink-400/30 to-blue-400/30 rounded-full"
        />

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
                    delay: (i % 40) * 0.2 // Deterministic delay
                  }}
                  className="border border-purple-500/10"
                />
              ))}
            </div>
          </div>
        )}

        {/* Floating Code Elements */}
        {variant === 'default' && (
          <>
            <motion.div
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/5 left-1/8 text-purple-400/20 font-mono text-xs"
            >
              {'{ code }'}
            </motion.div>
            
            <motion.div
              animate={{
                y: [0, 25, 0],
                opacity: [0.1, 0.5, 0.1]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
              className="absolute bottom-1/4 right-1/8 text-pink-400/20 font-mono text-xs"
            >
              {'</>'}
            </motion.div>
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
