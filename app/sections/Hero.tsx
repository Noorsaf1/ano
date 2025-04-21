'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSiteContext } from '../context/SiteContext'

export default function Hero() {
  const { siteData } = useSiteContext()
  const hasSlider = siteData.hero.images && siteData.hero.images.length > 0
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Om vi har en slider, rotera genom bilderna med en timer
  useEffect(() => {
    if (!hasSlider) return
    
    const timer = setInterval(() => {
      setCurrentSlide(current => {
        const nextSlide = current + 1
        return nextSlide >= (siteData.hero.images?.length || 0) ? 0 : nextSlide
      })
    }, 5000) // Byter bild var 5:e sekund
    
    return () => clearInterval(timer)
  }, [hasSlider, siteData.hero.images])
  
  // Gå till föregående/nästa bild
  const prevSlide = () => {
    if (!hasSlider) return
    setCurrentSlide(current => {
      return current === 0 ? (siteData.hero.images?.length || 1) - 1 : current - 1
    })
  }
  
  const nextSlide = () => {
    if (!hasSlider) return
    setCurrentSlide(current => {
      return current === (siteData.hero.images?.length || 1) - 1 ? 0 : current + 1
    })
  }
  
  // Välj bakgrundsbild baserat på om vi har slider eller inte
  const heroBackground = hasSlider 
    ? siteData.hero.images?.[currentSlide] || siteData.hero.image 
    : siteData.hero.image
  
  return (
    <section id="home" className="h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBackground})`,
          transition: 'background-image 0.8s ease-in-out'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <motion.h1 
          className="text-5xl md:text-7xl font-serif tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {siteData.hero.heading}
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl mt-6 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {siteData.hero.tagline}
        </motion.p>
      </div>
      
      {/* Slider navigeringspunkter */}
      {hasSlider && siteData.hero.images && siteData.hero.images.length > 1 && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-3 z-20">
          {siteData.hero.images.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-2 transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/40'
              } rounded-full`}
              aria-label={`Gå till bild ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Mouse scroll indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <a href="#about" aria-label="Scrolla ner för att se mer">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </a>
      </motion.div>
    </section>
  )
} 