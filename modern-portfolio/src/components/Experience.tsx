'use client'

import { motion } from 'framer-motion'
import resumeData from '@/data/resume.json'
import AnimatedBackground from './AnimatedBackground'
import { CompanyLogo } from './CompanyLogos'

export default function Experience() {
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
          Professional Journey
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          My experience across top companies and research institutions
        </p>
      </motion.div>

      <div className="space-y-8">
        {resumeData.workExperience.map((experience, index) => (
          <motion.div
            key={experience.company}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-xl hover-lift"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <CompanyLogo 
                  company={experience.company}
                  color={experience.color}
                  size="lg"
                />
              </div>

              {/* Experience Details */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2" style={{ color: experience.color }}>
                  {experience.company}
                </h3>
                <p className="text-muted-foreground mb-4">{experience.companyDescription}</p>

                {/* Positions */}
                <div className="space-y-4">
                  {experience.positions.map((position, posIndex) => (
                    <div key={posIndex} className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-xl font-semibold mb-2">{position.title}</h4>
                      <p className="text-muted-foreground mb-2">
                        {position.period} • {position.duration} • {position.employmentType}
                      </p>
                      
                      {/* Achievements */}
                      <ul className="space-y-2 mb-4">
                        {position.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-sm leading-relaxed">
                            • {achievement}
                          </li>
                        ))}
                      </ul>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {position.skillsDeveloped.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D Floating Elements */}
      <div className="relative h-40 overflow-hidden mt-16">
        <motion.div
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 360],
            z: [0, 100, 0],
            x: [0, 50, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-1/6 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ 
            rotateY: [360, 0],
            rotateZ: [0, 360],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-5 right-1/4 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ 
            rotateX: [360, 0],
            rotateZ: [0, 360],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-12 left-1/2 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 transform rotate-45"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            rotateX: [360, 0],
            z: [0, 80, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-8 right-1/6 w-8 h-8 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg"
          style={{ transformStyle: 'preserve-3d' }}
        />
      </div>
    </section>
    </AnimatedBackground>
  )
}
