'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiInstagramLine, RiFacebookLine, RiTwitterLine } from 'react-icons/ri'
import { useSiteContext } from '../context/SiteContext'

export default function Contact() {
  const { siteData } = useSiteContext()
  const { email, phone, address, hours } = siteData.contact

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle form submission here
    console.log('Form submitted:', formData)
    alert('Tack för ditt meddelande! Jag återkommer till dig så snart som möjligt.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif">Kontakt</h2>
          <div className="w-20 h-px bg-accent mx-auto mt-4 mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg">
            Jag ser fram emot att höra från dig. Kontakta mig gärna för att diskutera dina fotograferingsbehov.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">
                  Ditt namn
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-primary border border-subtle focus:border-accent outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Din e-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-primary border border-subtle focus:border-accent outline-none"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                  Ämne
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-primary border border-subtle focus:border-accent outline-none"
                >
                  <option value="">Välj ett ämne</option>
                  <option value="Portrait Inquiry">Porträttförfrågan</option>
                  <option value="Wedding Inquiry">Bröllopsförfrågan</option>
                  <option value="Event Inquiry">Evenemangsförfrågan</option>
                  <option value="Other">Annat</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">
                  Ditt meddelande
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-3 bg-primary border border-subtle focus:border-accent outline-none"
                ></textarea>
              </div>
              <button type="submit" className="btn w-full">
                Skicka meddelande
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-serif mb-4">Kontaktinformation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <RiMailLine className="text-lg" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <RiPhoneLine className="text-lg" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <RiMapPinLine className="text-lg" />
                  <span>{address}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif mb-4">Öppettider</h3>
              <p className="mb-2">{hours}</p>
              <p>Helger: Endast efter överenskommelse</p>
            </div>

            <div>
              <h3 className="text-xl font-serif mb-4">Följ mig</h3>
              <div className="flex gap-4">
                <a href="#" className="text-2xl hover:text-accent transition-colors duration-300">
                  <RiInstagramLine />
                </a>
                <a href="#" className="text-2xl hover:text-accent transition-colors duration-300">
                  <RiFacebookLine />
                </a>
                <a href="#" className="text-2xl hover:text-accent transition-colors duration-300">
                  <RiTwitterLine />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif mb-4">Svarstid</h3>
              <p>Jag svarar vanligtvis på förfrågningar inom 24-48 timmar.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 