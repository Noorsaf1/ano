'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSiteContext } from '../context/SiteContext'

export default function About() {
  const { siteData } = useSiteContext()
  const { title, bio, image } = siteData.about

  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container-custom">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Image */}
          <div className="relative h-[500px] md:h-[600px]">
            <Image 
              src={image}
              alt="Elena Petrova - Professionell Fotograf"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif">{title}</h2>
            <div className="w-20 h-px bg-accent"></div>
            <p className="text-lg leading-relaxed">
              {bio}
            </p>
            <div>
              <button className="btn mt-4">Min metod</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 