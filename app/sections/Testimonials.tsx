'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiStarFill } from 'react-icons/ri'
import { useSiteContext } from '../context/SiteContext'

export default function Testimonials() {
  const { siteData } = useSiteContext()
  const [activeIndex, setActiveIndex] = useState(0)
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === siteData.testimonials.length - 1 ? 0 : prevIndex + 1
    )
  }
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? siteData.testimonials.length - 1 : prevIndex - 1
    )
  }

  // Säkerställ att vi har minst ett vittnesmål
  if (siteData.testimonials.length === 0) {
    return null
  }

  return (
    <section id="testimonials" className="py-24">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif">Omdömen</h2>
          <div className="w-20 h-px bg-accent mx-auto mt-4 mb-6"></div>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="testimonial-card"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
              <div className="w-24 h-24 relative rounded-full overflow-hidden bg-subtle flex items-center justify-center">
                {siteData.testimonials[activeIndex].avatar ? (
                  <Image
                    src={siteData.testimonials[activeIndex].avatar}
                    alt={siteData.testimonials[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl">{siteData.testimonials[activeIndex].name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} className="text-accent text-lg" />
                  ))}
                </div>
                <p className="italic mb-4 text-lg">{siteData.testimonials[activeIndex].text}</p>
                <p className="font-serif text-lg">{siteData.testimonials[activeIndex].name}</p>
                <p className="text-sm">{siteData.testimonials[activeIndex].role}</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 border border-text flex items-center justify-center hover:bg-text hover:text-primary transition-all duration-300"
              aria-label="Föregående omdöme"
            >
              &larr;
            </button>
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 border border-text flex items-center justify-center hover:bg-text hover:text-primary transition-all duration-300"
              aria-label="Nästa omdöme"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 