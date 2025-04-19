'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSiteContext } from '../context/SiteContext'

export default function Services() {
  const { siteData } = useSiteContext()

  return (
    <section id="services" className="py-24 bg-subtle">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif">Tjänster</h2>
          <div className="w-20 h-px bg-accent mx-auto mt-4 mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg">
            Professionella fotograferingstjänster anpassade efter dina unika behov och vision.
          </p>
        </motion.div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteData.services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-primary shadow-sm hover:shadow-md transition-all duration-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative h-64">
                {service.icon.startsWith('http') || service.icon.startsWith('blob:') ? (
                  <Image
                    src={service.icon}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-subtle flex items-center justify-center">
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif mb-2">{service.title}</h3>
                <p className="mb-4">{service.description}</p>
                <button className="btn w-full">Kontakta mig</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 