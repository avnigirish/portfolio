'use client'

import { motion } from 'framer-motion'
import resumeData from '@/data/resume.json'
import AnimatedBackground from './AnimatedBackground'

export default function About() {
  const metrics = [
    { value: '8+', label: 'Companies Worked At' },
    { value: '650+', label: 'Students Tutored' },
    { value: '6+', label: 'Certifications' },
    { value: '2', label: 'Research Projects' }
  ]

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
