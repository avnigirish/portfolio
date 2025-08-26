'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import resumeData from '@/data/resume.json'
import AnimatedBackground from './AnimatedBackground'
import { CompanyLogo } from './CompanyLogos'

export default function About() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const metrics = [
    { value: '8+', label: 'Companies Worked At' },
    { value: '650+', label: 'Students Tutored' },
    { value: '6+', label: 'Certifications' },
    { value: '2', label: 'Research Projects' }
  ]

  if (!isMounted) {
    return (
      <AnimatedBackground variant="subtle">
        <section className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              About Me
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate about the intersection of artificial intelligence and cognitive science
            </p>
          </div>
          {/* Static content while hydrating */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Loading...
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {metrics.map((metric, index) => (
                <div key={metric.label} className="text-center glass p-6 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {metric.value}
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedBackground>
    )
  }

  return (
    <AnimatedBackground variant="subtle">
      <section className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
          About Me
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Passionate about the intersection of artificial intelligence and cognitive science
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* About Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-lg leading-relaxed">
            I'm a <span className="text-purple-500 font-semibold">
            {resumeData.education.degree}</span> student at{' '}
            <span className="text-purple-500 font-semibold">
            {resumeData.education.university}</span>, passionate about leveraging technology 
            to solve complex problems and create meaningful impact.
          </p>
          
          <p className="text-lg leading-relaxed">
            My journey spans across <span className="text-purple-500 font-semibold">
            artificial intelligence research</span>, where I study cognitive processes and numerical 
            decision-making, to <span className="text-purple-500 font-semibold">
            software engineering</span> at leading financial institutions like BNY and Morgan Stanley.
          </p>

          <p className="text-lg leading-relaxed">
            I'm particularly interested in the intersection of AI and cognitive science, 
            exploring how human cognition can inform better AI systems and vice versa.
          </p>

          {/* Additional Professional Information */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 space-y-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-muted-foreground">🇺🇸 US Citizen</span>
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-muted-foreground">📍 Open to Relocate</span>
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-muted-foreground">📄 References Available on Request</span>
              </span>
            </div>
          </div>

          {/* Education Highlight */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass p-6 rounded-xl hover-lift"
          >
            <h3 className="text-xl font-bold mb-2 text-purple-500">
              Current Education
            </h3>
            <p className="text-lg font-semibold">{resumeData.education.degree}</p>
            <p className="text-muted-foreground">{resumeData.education.university}</p>
            <p className="text-muted-foreground">Expected Graduation: {resumeData.education.graduation}</p>
          </motion.div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              viewport={{ once: true }}
              className="text-center glass p-6 rounded-xl hover-lift"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1 + 0.3 
                }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold gradient-text mb-2"
              >
                {metric.value}
              </motion.div>
              <p className="text-muted-foreground font-medium">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Companies I've Worked With */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
          Companies I've Worked With
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {resumeData.workExperience.slice(0, 5).map((experience, index) => (
            <motion.div
              key={experience.company}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="relative"
              >
                <CompanyLogo 
                  company={experience.company}
                  color={experience.color}
                  size="lg"
                />
                {/* Company name tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10"
                >
                  {experience.company}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Organizations */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
          Organizations & Involvement
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resumeData.education.organizations.map((org, index) => (
            <motion.div
              key={org}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              className="text-center glass p-4 rounded-lg hover-lift"
            >
              <p className="text-sm font-medium">{org}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
    </AnimatedBackground>
  )
}
