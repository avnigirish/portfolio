import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import EnhancedSkills from '@/components/EnhancedSkills'
import Projects from '@/components/Projects'
import DataVisualization from '@/components/DataVisualization'
import EnhancedAIChat from '@/components/EnhancedAIChat'
import ThreeDBackground from '@/components/ThreeDBackground'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* 3D Background */}
      <ThreeDBackground />
      
      <Header />
      <main>
        <section id="hero" className="py-20 relative z-10">
          <AnimatedBackground variant="hero">
            <Hero />
          </AnimatedBackground>
        </section>
        <section id="about" className="py-20 relative z-10">
          <AnimatedBackground variant="about">
            <About />
          </AnimatedBackground>
        </section>
        <section id="experience" className="py-20 relative z-10">
          <AnimatedBackground variant="experience">
            <Experience />
          </AnimatedBackground>
        </section>
        <section id="skills" className="py-20 relative z-10">
          <AnimatedBackground variant="skills">
            <EnhancedSkills />
          </AnimatedBackground>
        </section>
        <section id="projects" className="py-20 relative z-10">
          <AnimatedBackground variant="projects">
            <Projects />
          </AnimatedBackground>
        </section>
        <section id="data-viz" className="py-20 relative z-10">
          <AnimatedBackground variant="subtle">
            <DataVisualization />
          </AnimatedBackground>
        </section>
        <section id="contact" className="py-20 relative z-10">
          <AnimatedBackground variant="contact">
            <Contact />
          </AnimatedBackground>
        </section>
      </main>
      
      <AnimatedBackground variant="subtle">
        <Footer />
      </AnimatedBackground>
      
      {/* Enhanced Features */}
      <EnhancedAIChat />
      <AdvancedAnalytics />
      <SpotifyNowPlaying />
    </div>
  )
}
