'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSiteContext } from '../context/SiteContext'

export default function Hero() {
  const { siteData } = useSiteContext()
  const { heading, tagline, image } = siteData.hero

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt="Hjältebild - Professionell fotograf"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-text/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-primary">
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-widest text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {heading}
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl font-sans tracking-wider text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {tagline}
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="mouse">
          <div className="wheel" />
        </div>
      </motion.div>
    </section>
  )
} 