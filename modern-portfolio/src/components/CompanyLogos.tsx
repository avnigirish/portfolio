// Company logo components
import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
}

export const AccentureLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 1000 1000" className={className}>
    <path
      d="M327.5 0L0 540h150l75-130h205l-75 130h150L672.5 0h-345z"
      fill="url(#accenture-gradient)"
    />
    <defs>
      <linearGradient id="accenture-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A100FF" />
        <stop offset="100%" stopColor="#7B2CBF" />
      </linearGradient>
    </defs>
  </svg>
)

export const MorganStanleyLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 200 200" className={className}>
    <rect width="200" height="200" fill="#1E40AF" rx="20"/>
    <text
      x="100"
      y="85"
      textAnchor="middle"
      fill="white"
      fontSize="40"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      MS
    </text>
    <text
      x="100"
      y="130"
      textAnchor="middle"
      fill="white"
      fontSize="14"
      fontFamily="Arial, sans-serif"
    >
      MORGAN
    </text>
    <text
      x="100"
      y="150"
      textAnchor="middle"
      fill="white"
      fontSize="14"
      fontFamily="Arial, sans-serif"
    >
      STANLEY
    </text>
  </svg>
)

export const NJEDALogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 300 120" className={className}>
    <rect width="300" height="120" fill="#2563EB" rx="10"/>
    <text
      x="30"
      y="45"
      fill="white"
      fontSize="32"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      NJ
    </text>
    <path
      d="M80 20 L95 20 L95 50 L120 50 L120 35 L135 35 L135 65 L80 65 Z"
      fill="#10B981"
    />
    <text
      x="150"
      y="30"
      fill="white"
      fontSize="16"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      EDA
    </text>
    <text
      x="150"
      y="50"
      fill="#10B981"
      fontSize="10"
      fontFamily="Arial, sans-serif"
    >
      ECONOMIC DEVELOPMENT
    </text>
    <text
      x="150"
      y="65"
      fill="#10B981"
      fontSize="10"
      fontFamily="Arial, sans-serif"
    >
      AUTHORITY
    </text>
  </svg>
)

export const RutgersLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 200 200" className={className}>
    <rect width="200" height="200" fill="#CC0033" rx="20"/>
    <text
      x="100"
      y="120"
      textAnchor="middle"
      fill="white"
      fontSize="72"
      fontWeight="bold"
      fontFamily="Georgia, serif"
    >
      R
    </text>
    <circle cx="100" cy="40" r="15" fill="white"/>
  </svg>
)

export const BNYLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 200 200" className={className}>
    <rect width="200" height="200" fill="#0066CC" rx="20"/>
    <text
      x="100"
      y="85"
      textAnchor="middle"
      fill="white"
      fontSize="36"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      BNY
    </text>
    <text
      x="100"
      y="110"
      textAnchor="middle"
      fill="white"
      fontSize="14"
      fontFamily="Arial, sans-serif"
    >
      MELLON
    </text>
    <rect x="20" y="130" width="160" height="3" fill="#FFD700"/>
  </svg>
)

// Enhanced Company Logo Component with animations
interface CompanyLogoProps {
  company: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export const CompanyLogo = ({ company, color = '#8B5CF6', size = 'md' }: CompanyLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  }

  const getLogoComponent = () => {
    const className = `${sizeClasses[size]} drop-shadow-lg`
    
    switch (company.toLowerCase()) {
      case 'accenture':
        return <AccentureLogo className={className} />
      case 'morgan stanley':
        return <MorganStanleyLogo className={className} />
      case 'new jersey economic development authority (njeda)':
        return <NJEDALogo className={className} />
      case 'rutgers university-new brunswick':
        return <RutgersLogo className={className} />
      case 'bny':
        return <BNYLogo className={className} />
      default:
        // Fallback to emoji with enhanced styling
        return (
          <div 
            className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg`}
            style={{ color }}
          >
            🏢
          </div>
        )
    }
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
        {getLogoComponent()}
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
