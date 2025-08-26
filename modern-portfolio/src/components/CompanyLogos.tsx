// Company logo components
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface CompanyLogoProps {
  company: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export const CompanyLogo = ({ company, color = '#8B5CF6', size = 'md' }: CompanyLogoProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  }

  const getLogoSrc = () => {
    switch (company.toLowerCase()) {
      case 'accenture':
        return '/company-logos/accenture.png'
      case 'morgan stanley':
        return '/company-logos/morgan_stanley.png'
      case 'new jersey economic development authority (njeda)':
        return '/company-logos/njeda.png'
      case 'rutgers university-new brunswick':
        return '/company-logos/rutgers.png'
      case 'bny':
        return '/company-logos/bny.png'
      default:
        // Fallback to emoji with enhanced styling
        return null
    }
  }

  const logoSrc = getLogoSrc()

  // Show static version during SSR/hydration
  if (!isMounted) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
        🏢
      </div>
    )
  }

  return (
    <motion.div
      className="relative"
      whileHover={{ 
        scale: 1.1,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 10,
        delay: 0.1
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-xl blur-md"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Logo content */}
      <div className="relative z-10">
        {logoSrc ? (
          <div className={`${sizeClasses[size]} relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm p-2`}>
            <Image
              src={logoSrc}
              alt={`${company} logo`}
              fill
              className="object-contain p-1"
              sizes="(max-width: 768px) 48px, (max-width: 1200px) 64px, 80px"
            />
          </div>
        ) : (
          // Fallback to emoji with enhanced styling
          <div 
            className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg`}
            style={{ color }}
          >
            🏢
          </div>
        )}
      </div>
      
      {/* Pulse ring animation */}
      <motion.div
        className="absolute inset-0 border-2 border-purple-500/50 rounded-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.2, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}
