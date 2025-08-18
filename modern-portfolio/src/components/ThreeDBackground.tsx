'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  connections: number[]
}

export default function ThreeDBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const linesRef = useRef<THREE.LineSegments | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    
    mountRef.current.appendChild(renderer.domElement)
    
    // Store references
    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera

    // Particle system
    const particleCount = 100
    const particles: Particle[] = []
    const particleGeometry = new THREE.BufferGeometry()
    const lineGeometry = new THREE.BufferGeometry()
    
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        connections: []
      }
      
      particles.push(particle)
      
      // Set positions
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z
      
      // Set colors (purple to pink gradient)
      const t = i / particleCount
      colors[i * 3] = 0.5 + t * 0.3     // R
      colors[i * 3 + 1] = 0.2 + t * 0.6  // G
      colors[i * 3 + 2] = 0.8 + t * 0.2  // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    // Particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    })
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)
    particlesRef.current = particleSystem
    
    // Line material for connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.3
    })
    
    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lineSystem)
    linesRef.current = lineSystem
    
    // Camera position
    camera.position.z = 15
    
    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    
    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    // Visibility change handler
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }
    
    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      
      if (!isVisible) return
      
      // Update particles
      const positions = particleGeometry.attributes.position.array as Float32Array
      const linePositions: number[] = []
      
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        
        // Update position
        particle.position.add(particle.velocity)
        
        // Boundary check
        if (Math.abs(particle.position.x) > 10) particle.velocity.x *= -1
        if (Math.abs(particle.position.y) > 10) particle.velocity.y *= -1
        if (Math.abs(particle.position.z) > 10) particle.velocity.z *= -1
        
        // Mouse interaction
        const mouseInfluence = new THREE.Vector3(
          mouseRef.current.x * 5,
          mouseRef.current.y * 5,
          0
        )
        const distance = particle.position.distanceTo(mouseInfluence)
        if (distance < 5) {
          const force = mouseInfluence.clone().sub(particle.position).normalize().multiplyScalar(0.001)
          particle.velocity.add(force)
        }
        
        // Update geometry
        positions[i * 3] = particle.position.x
        positions[i * 3 + 1] = particle.position.y
        positions[i * 3 + 2] = particle.position.z
        
        // Create connections
        particle.connections = []
        for (let j = i + 1; j < particles.length; j++) {
          const distance = particle.position.distanceTo(particles[j].position)
          if (distance < 5) {
            particle.connections.push(j)
            
            // Add line
            linePositions.push(
              particle.position.x, particle.position.y, particle.position.z,
              particles[j].position.x, particles[j].position.y, particles[j].position.z
            )
          }
        }
      }
      
      // Update geometries
      particleGeometry.attributes.position.needsUpdate = true
      
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      
      // Rotate scene slightly
      scene.rotation.y += 0.001
      
      // Camera movement based on mouse
      camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.05
      camera.position.y += (-mouseRef.current.y * 2 - camera.position.y) * 0.05
      camera.lookAt(scene.position)
      
      renderer.render(scene, camera)
    }
    
    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Start animation
    animate()
    
    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Dispose of Three.js objects
      particleGeometry.dispose()
      lineGeometry.dispose()
      particleMaterial.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [isVisible])

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  )
}
