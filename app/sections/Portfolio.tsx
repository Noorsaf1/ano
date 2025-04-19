'use client'

import { useState } from 'react'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import { motion } from 'framer-motion'
import { useSiteContext } from '../context/SiteContext'

// Portfolio data
const CATEGORIES = [
  { id: 'all', name: 'Alla' },
  { id: 'portraits', name: 'Porträtt' },
  { id: 'weddings', name: 'Bröllop' },
  { id: 'nature', name: 'Natur' },
]

// Breakpoints for masonry grid
const breakpointColumnsObj = {
  default: 3,
  1024: 3,
  768: 2,
  640: 1
}

export default function Portfolio() {
  const { siteData } = useSiteContext()
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredItems = activeCategory === 'all' 
    ? siteData.portfolio 
    : siteData.portfolio.filter(item => item.category === activeCategory)

  return (
    <section id="portfolio" className="py-24">
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif">Portfolio</h2>
          <div className="w-20 h-px bg-accent mx-auto mt-4 mb-8"></div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-8 mt-8">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-text text-primary' 
                    : 'bg-transparent text-text hover:bg-subtle'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-column"
          >
            {filteredItems.map(item => (
              <div key={item.id} className="image-container">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={800}
                  className="w-full h-auto"
                />
                <div className="image-overlay">
                  <span className="text-primary text-lg font-serif tracking-wider">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </Masonry>
        </motion.div>
      </div>
    </section>
  )
} 