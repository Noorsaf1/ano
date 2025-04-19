'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'

const NAV_LINKS = [
  { name: 'Hem', href: '/' },
  { name: 'Om mig', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Tjänster', href: '#services' },
  { name: 'Omdömen', href: '#testimonials' },
  { name: 'Kontakt', href: '#contact' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-primary/95 shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="container-custom flex justify-between items-center">
        <Link 
          href="/"
          className="font-serif text-2xl tracking-widest"
        >
          ANO 
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              className="nav-link"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin" className="nav-link text-accent">
            Admin
          </Link>
        </nav>

        {/* Mobile Nav Button */}
        <button 
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Stäng meny' : 'Öppna meny'}
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary/95 py-4 shadow-md">
          <nav className="container-custom flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/admin" 
              className="nav-link text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
} 