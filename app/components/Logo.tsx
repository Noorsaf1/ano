'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LogoProps {
  colorMode?: 'light' | 'dark'
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ 
  colorMode = 'dark', 
  showText = true, 
  size = 'md',
  className = ''
}: LogoProps) {
  // Bestäm färgpalett baserat på färgläge
  const colors = {
    primary: colorMode === 'dark' ? '#333333' : '#FFFFFF', // text / main color
    accent: '#E8E0D0',
    camera: '#FADADD', // Ljus rosa färg för kameran
    flower: '#FFC0CB', // Rosa för blommorna
    flowerCenter: '#FFEF96' // Gul för blommornas mittpunkt
  }
  
  // Bestäm storlek
  const dimensions = {
    sm: { width: 42, height: 56, fontSize: 'text-base' },
    md: { width: 48, height: 68, fontSize: 'text-xl' },
    lg: { width: 56, height: 80, fontSize: 'text-2xl' }
  }
  
  const { width, height, fontSize } = dimensions[size]
  
  // Animation för logon
  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  }

  // Funktion för att skapa en liten blomma
  const createSmallFlower = (x: number, y: number, size: number) => (
    <g transform={`translate(${x}, ${y})`}>
      {/* Flower Petals */}
      <circle cx="0" cy={`-${size * 0.6}`} r={size * 0.6} fill={colors.flower} opacity="0.75" />
      <circle cx={`${size * 0.6}`} cy="0" r={size * 0.6} fill={colors.flower} opacity="0.75" />
      <circle cx="0" cy={`${size * 0.6}`} r={size * 0.6} fill={colors.flower} opacity="0.75" />
      <circle cx={`-${size * 0.6}`} cy="0" r={size * 0.6} fill={colors.flower} opacity="0.75" />
      
      {/* Flower Center */}
      <circle cx="0" cy="0" r={size * 0.4} fill={colors.flowerCenter} stroke={colors.primary} strokeWidth="0.3" />
    </g>
  )

  return (
    <Link href="/">
      <motion.div 
        className={`flex flex-col items-center ${className}`}
        variants={logoVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {/* Camera SVG Icon with Small Flowers */}
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 48 68" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Small Flowers - only top half, more spaced */}
          {createSmallFlower(10, 8, 3.5)}
          {createSmallFlower(24, 5, 4)}
          {createSmallFlower(38, 8, 3.5)}
          {createSmallFlower(42, 18, 3.8)}
          {createSmallFlower(6, 18, 3.8)}
          
          {/* Camera Body - Centered */}
          <rect 
            x="11" 
            y="17" 
            width="26" 
            height="16" 
            rx="3" 
            fill={colors.camera} 
            stroke={colors.primary}
            strokeWidth="1"
          />
          
          {/* Camera Lens */}
          <circle 
            cx="24" 
            cy="25" 
            r="5" 
            fill={colors.accent} 
            stroke={colors.primary} 
            strokeWidth="1" 
          />
          
          {/* Camera Center */}
          <circle 
            cx="24" 
            cy="25" 
            r="2.5" 
            fill={colors.primary} 
          />
          
          {/* Camera Flash */}
          <rect 
            x="28" 
            y="13" 
            width="7" 
            height="3.5" 
            rx="1.5" 
            fill={colors.camera}
            stroke={colors.primary}
            strokeWidth="0.8" 
          />
          
          {/* Camera Viewfinder */}
          <rect 
            x="13" 
            y="19.5" 
            width="3.5" 
            height="2" 
            rx="1" 
            fill={colors.accent} 
          />
          
          {/* Logo Text */}
          {showText && (
            <text 
              x="24" 
              y="56"
              textAnchor="middle"
              className={`${fontSize} font-serif tracking-widest`}
              fill={colors.primary}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ANO
            </text>
          )}
        </svg>
      </motion.div>
    </Link>
  )
} 