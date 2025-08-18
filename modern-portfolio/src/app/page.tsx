import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import ClientOnlyFloatingChat from '@/components/ClientOnlyFloatingChat'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="hero" className="py-20">
          <Hero />
        </section>
        <section id="about" className="py-20">
          <About />
        </section>
        <section id="experience" className="py-20">
          <Experience />
        </section>
        <section id="skills" className="py-20">
          <Skills />
        </section>
        <section id="projects" className="py-20">
          <Projects />
        </section>
        <section id="contact" className="py-20">
          <Contact />
        </section>
      </main>
      <Footer />
      <ClientOnlyFloatingChat />
    </div>
  )
}
