'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const NAV_LINKS = [
  { name: 'Hem', href: '/' },
  { name: 'Om mig', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Tjänster', href: '#services' },
  { name: 'Omdömen', href: '#testimonials' },
  { name: 'Kontakt', href: '#contact' },
]

// Animation variants
const menuVariants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: { 
      duration: 0.4,
      ease: "easeInOut" 
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 0.05 * i,
      duration: 0.3
    }
  })
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('/')
  const headerRef = useRef<HTMLElement>(null)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
      
      // Close menu on scroll
      if (isMenuOpen && scrollPosition > 50) {
        setIsMenuOpen(false)
      }
      
      // Update active link based on scroll position
      const sections = NAV_LINKS.map(link => link.href.replace('#', '')).filter(id => id !== '/')
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink('#' + section)
            break
          } else if (scrollPosition < 100) {
            setActiveLink('/')
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMenuOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node) && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  return (
    <header 
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-primary/95 shadow-sm py-3' : 'bg-transparent py-6'}`}
    >
      <div className="container-custom flex justify-between items-center">
        <Logo 
          colorMode={isScrolled || isMenuOpen ? 'dark' : 'light'} 
          size="md" 
        />

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              className={`nav-link ${activeLink === link.href ? 'after:w-full' : ''}`}
              onClick={() => setActiveLink(link.href)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin" className="nav-link text-accent">
            Admin
          </Link>
        </nav>

        {/* Mobile Nav Button - Updated with better styling */}
        <motion.button 
          className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20 transition-colors duration-300 hover:bg-accent/20"
          onClick={(e) => {
            e.stopPropagation(); 
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label={isMenuOpen ? 'Stäng meny' : 'Öppna meny'}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isMenuOpen}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RiCloseLine className="text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RiMenu3Line className="text-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Nav Menu - Updated with animations and improved styling */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="bg-primary/95 backdrop-blur-sm border-t border-b border-accent/20 shadow-lg">
              <nav className="container-custom py-6">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.name}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="menu-item-animation"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link 
                      href={link.href}
                      className={`mobile-nav-link border-b border-accent/10 last:border-0 ${activeLink === link.href ? 'active bg-accent/5' : ''}`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveLink(link.href);
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  custom={NAV_LINKS.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="menu-item-animation"
                  style={{ animationDelay: `${NAV_LINKS.length * 0.05}s` }}
                >
                  <Link 
                    href="/admin" 
                    className="mobile-nav-link text-accent mt-4 bg-accent/10 rounded flex justify-center items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Admin</span>
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 