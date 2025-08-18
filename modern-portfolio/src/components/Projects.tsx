'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import AnimatedBackground from './AnimatedBackground'
import EnhancedAIAgents from './EnhancedAIAgents'

export default function Projects() {
  const [activeTab, setActiveTab] = useState('ai-demos')

  const tabs = [
    { id: 'ai-demos', label: 'AI Agents', icon: '🤖' },
    { id: 'research', label: 'Research', icon: '🧠' },
    { id: 'projects', label: 'Projects', icon: '💻' }
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
          Projects & Research
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Showcasing AI applications, research work, and technical projects with interactive data visualizations
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="glass p-2 rounded-xl">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'ai-demos' && <EnhancedAIAgents />}
        {activeTab === 'research' && <ResearchProjects />}
        {activeTab === 'projects' && <TechnicalProjects />}
      </motion.div>
    </section>
    </AnimatedBackground>
  )
}

function ResearchProjects() {
  const projects = [
    {
      title: "Hunger and Cognitive Decision-Making",
      description: "Research examining how hunger affects children's cognitive processes in numerical decision-making under Dr. Jenny Wang at Rutgers University.",
      tags: ["Cognitive Science", "Research", "Data Analysis", "MATLAB"],
      status: "Ongoing"
    },
    {
      title: "Numerical Cognition Across Lifespan",
      description: "Study focused on examining cognitive components and learning systems underlying number and quantity understanding in humans.",
      tags: ["Cognitive Science", "Python", "Data Visualization", "Research"],
      status: "In Progress"
    }
  ]

  return (
    <div className="grid gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="glass p-8 rounded-xl hover-lift"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold gradient-text">{project.title}</h3>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
              {project.status}
            </span>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function TechnicalProjects() {
  const projects = [
    {
      title: "MoodSync+: Mental & Physical Wellness App",
      description: "AI-powered platform with Python, FastAPI, and Streamlit, integrating Spotify API for personalized recommendations. Features NLP sentiment analysis with 95% accuracy.",
      technologies: ["Python", "FastAPI", "Streamlit", "Spotify API", "OpenAI API", "PostgreSQL"],
      github: "https://github.com/avnigirish/moodsync",
      color: "text-purple-500"
    },
    {
      title: "Automated Car Simulation",
      description: "AI-powered car simulation using neural networks and genetic algorithms with ray casting and collision physics, optimizing vehicle performance by 20%.",
      technologies: ["JavaScript", "Neural Networks", "Genetic Algorithms", "Ray Casting"],
      github: "https://github.com/avnigirish/Automatic-Car-Simulation",
      color: "text-pink-500"
    },
    {
      title: "Modern Portfolio",
      description: "This responsive portfolio built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Features 3D animations, dark/light mode, and interactive demos.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
      github: "#",
      color: "text-blue-500"
    }
  ]

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 gradient-text">Featured Projects</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore my latest projects showcasing AI, web development, and interactive experiences.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="glass p-8 rounded-xl hover-lift group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h4 className={`text-xl font-bold ${project.color} group-hover:scale-105 transition-transform`}>
                  {project.title}
                </h4>
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotateZ: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 glass rounded-lg hover:bg-purple-500/20 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground transition-colors">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index * 0.2) + (techIndex * 0.1) }}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-500 rounded-full text-xs hover:scale-110 transition-transform cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>

              {/* 3D Interactive Elements */}
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ rotateX: 15, rotateY: 15, scale: 1.1 }}
                  className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg opacity-20 group-hover:opacity-60 transition-opacity"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                <motion.div
                  whileHover={{ rotateX: -15, rotateY: -15, scale: 1.1 }}
                  className="w-6 h-6 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full opacity-20 group-hover:opacity-60 transition-opacity"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                <motion.div
                  whileHover={{ rotateZ: 45, scale: 1.2 }}
                  className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rotate-45 opacity-20 group-hover:opacity-60 transition-opacity"
                  style={{ transformStyle: 'preserve-3d' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional 3D Floating Elements */}
      <div className="relative h-32 overflow-hidden">
        <motion.div
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 360],
            z: [0, 50, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ 
            rotateX: [360, 0],
            rotateZ: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-5 right-1/3 w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            rotateZ: [360, 0],
            x: [0, 30, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-8 right-1/4 w-6 h-6 bg-gradient-to-br from-pink-500/30 to-blue-500/30 transform rotate-45"
          style={{ transformStyle: 'preserve-3d' }}
        />
      </div>
    </div>
  )
}
