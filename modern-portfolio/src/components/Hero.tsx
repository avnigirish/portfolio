'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import resumeData from '@/data/resume.json'

export default function Hero() {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const roles = ['AI Researcher', 'Software Engineer', 'Data Scientist', 'CS Student']

  useEffect(() => {
    const role = roles[currentIndex]
    let index = 0
    const timer = setInterval(() => {
      if (index <= role.length) {
        setDisplayText(role.slice(0, index))
        index++
      } else {
        clearInterval(timer)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % roles.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [currentIndex])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        {/* Floating Particles */}
        {Array.from({ length: 50 }).map((_, i) => (
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
              duration: 20 + (i % 10), // Deterministic duration
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -100, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />

        {/* Geometric Shapes */}
        <motion.div
          animate={{
            rotateZ: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/5 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 transform rotate-45 opacity-60"
        />
        
        <motion.div
          animate={{
            rotateX: [0, 360],
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60"
        />

        {/* Matrix-like Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: (i % 20) * 0.25 // Deterministic delay
                }}
                className="border border-purple-500/20"
              />
            ))}
          </div>
        </div>

        {/* Floating Code Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/6 text-purple-400/30 font-mono text-sm"
        >
          {'< AI />'}
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/3 right-1/6 text-pink-400/30 font-mono text-sm"
        >
          {'data = magic()'}
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-6"
        >
          <span className="block text-foreground">Hello, I'm</span>
          <motion.span
            className="block gradient-text"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {resumeData.personalInfo.name}
          </motion.span>
        </motion.h1>

        {/* Dynamic subtitle */}
        <motion.div
          variants={itemVariants}
          className="text-2xl md:text-3xl text-muted-foreground mb-8 h-12"
        >
          <span className="inline-block mr-2">I'm a</span>
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-purple-500 font-semibold"
          >
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1 h-8 bg-purple-500 ml-1"
            />
          </motion.span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Computer Science & Cognitive Science student at Rutgers University, passionate about 
          artificial intelligence, data science, and creating technology that makes a positive impact.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            Get In Touch
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border-2 border-purple-500 text-purple-500 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300"
          >
            View My Work
          </motion.button>

          <motion.a
            href="/resume.pdf"
            download="Avni_Girish_Resume.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-teal-500 text-teal-500 rounded-full font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300"
          >
            Download Resume
          </motion.a>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-500 rounded-full opacity-60"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/3 right-1/4 w-6 h-6 bg-pink-500 rounded-full opacity-60"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-500 rounded-full opacity-60"
          />

          {/* Additional 3D Elements */}
          <motion.div
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
              z: [0, 50, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg"
            style={{ transformStyle: 'preserve-3d' }}
          />
          <motion.div
            animate={{
              rotateY: [360, 0],
              rotateZ: [0, 360],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full"
            style={{ transformStyle: 'preserve-3d' }}
          />
          <motion.div
            animate={{
              rotateX: [360, 0],
              rotateZ: [0, 360],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/3 left-1/4 w-4 h-4 bg-gradient-to-br from-pink-500/30 to-blue-500/30 transform rotate-45"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
