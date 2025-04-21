'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiInstagramLine, RiFacebookLine, RiTwitterLine } from 'react-icons/ri'
import { useSiteContext } from '../context/SiteContext'
import emailjs from '@emailjs/browser'

// EmailJS-konfiguration - ersätt med dina egna nycklar
const EMAILJS_SERVICE_ID = 'service_hz33hxa'  // Ändra till din service-ID
const EMAILJS_TEMPLATE_ID = 'template_m3d6538' // Ändra till din mall-ID
const EMAILJS_PUBLIC_KEY = '943t-FZzYhbQZ2lCF' // Ändra till din public key

export default function Contact() {
  const { siteData } = useSiteContext()
  const { email, phone, address, hours } = siteData.contact
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({})
    
    // Använd EmailJS för att skicka formuläret med kunden som avsändare
    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      reply_to: formData.email, // Viktigt: Detta gör att du kan svara direkt till kunden
      from_name: formData.name  // Sätt kundens namn som avsändare
    }
    
    emailjs.send(
      EMAILJS_SERVICE_ID, 
      EMAILJS_TEMPLATE_ID, 
      templateParams, 
      EMAILJS_PUBLIC_KEY
    )
    .then((result) => {
      console.log('E-post skickad!', result.text)
      setSubmitStatus({
        success: true,
        message: 'Tack för ditt meddelande! Jag återkommer till dig så snart som möjligt.'
      })
      // Rensa formuläret efter lyckad sändning
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    })
    .catch((error) => {
      console.error('E-postfel:', error)
      setSubmitStatus({
        success: false,
        message: 'Ett fel uppstod när meddelandet skulle skickas. Försök igen eller kontakta mig direkt via e-post.'
      })
    })
    .finally(() => {
      setIsSubmitting(false)
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
            {submitStatus.message && (
              <div className={`mb-6 p-4 ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
              <button 
                type="submit" 
                className="btn w-full relative" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Skickar...' : 'Skicka meddelande'}
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
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