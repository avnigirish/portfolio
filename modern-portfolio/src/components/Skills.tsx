'use client'

import { motion } from 'framer-motion'
import resumeData from '@/data/resume.json'
import AnimatedBackground from './AnimatedBackground'

export default function Skills() {
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
          Technologies and tools I use to bring ideas to life
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
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
              {category.skills.map((skill, skillIndex) => (
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
                  className="glass p-4 rounded-lg text-center hover-lift cursor-pointer"
                >
                  <span className="text-sm font-medium">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certifications */}
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
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Certifications */}
          <div className="glass p-6 rounded-xl">
            <h4 className="text-xl font-bold mb-4 text-purple-500">Certifications</h4>
            <ul className="space-y-2">
              {resumeData.certifications.map((cert, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-sm leading-relaxed"
                >
                  • {cert}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Awards */}
          <div className="glass p-6 rounded-xl">
            <h4 className="text-xl font-bold mb-4 text-pink-500">Awards</h4>
            <ul className="space-y-2">
              {resumeData.awards.map((award, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-sm leading-relaxed"
                >
                  🏆 {award}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
    </AnimatedBackground>
  )
}
