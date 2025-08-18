'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import AIChat from '@/components/AIChat'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Fixed theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <Header />

      {/* Main content */}
      <main className="relative">
        {/* Hero Section */}
        <section id="home" className="min-h-screen">
          <Hero />
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <About />
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20">
          <Experience />
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <Skills />
        </section>

        {/* Projects/AI Demos Section */}
        <section id="projects" className="py-20">
          <Projects />
        </section>

        {/* AI Chat Section */}
        <section id="chat" className="py-20">
          <AIChat />
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <Contact />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  )
}
