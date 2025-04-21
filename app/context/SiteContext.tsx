'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getFromLocalStorage, setInLocalStorage, isClient } from '../lib/client-utils'

export type HeroData = {
  heading: string
  tagline: string
  image: string
  images?: string[] // Array med bilder för slider
}

export type AboutData = {
  title: string
  bio: string
  image: string
}

export type PortfolioItem = {
  id: number
  title: string
  category: string
  image: string
}

export type ServiceItem = {
  id: number
  title: string
  description: string
  icon: string
  price?: string
}

export type TestimonialItem = {
  id: number
  name: string
  role: string
  text: string
  avatar: string
}

export type ContactData = {
  email: string
  phone: string
  address: string
  hours: string
}

export type MenuItem = {
  id: string
  text: string
}

type SiteData = {
  hero: HeroData
  about: AboutData
  portfolio: PortfolioItem[]
  services: ServiceItem[]
  testimonials: TestimonialItem[]
  contact: ContactData
  siteName: string
  siteDescription: string
  menuItems: MenuItem[]
}

type SiteContextType = {
  siteData: SiteData
  updateHero: (data: HeroData) => void
  updateAbout: (data: AboutData) => void
  updatePortfolio: (items: PortfolioItem[]) => void
  updateServices: (items: ServiceItem[]) => void
  updateTestimonials: (items: TestimonialItem[]) => void
  updateContact: (data: ContactData) => void
  updateSiteInfo: (name: string, description: string) => void
  updateMenuItems: (items: MenuItem[]) => void
}

// Standardvärden
const defaultSiteData: SiteData = {
  hero: {
    heading: 'ANO',
    tagline: 'Fångar ögonblick som berättar din historia',
    image: 'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d'
  },
  about: {
    title: 'Om mig',
    bio: 'Med över 10 års erfarenhet inom fotografi specialiserar jag mig på att fånga autentiska ögonblick som berättar övertygande historier. Min metod kombinerar teknisk precision med kreativ vision för att skapa tidlösa bilder.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  portfolio: [
    {
      id: 1,
      title: 'Sommarporträtt',
      category: 'portraits',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'
    },
    {
      id: 2,
      title: 'Bröllopsdag',
      category: 'weddings',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a'
    },
  ],
  services: [
    {
      id: 1,
      title: 'Bröllop',
      description: 'Fånga de magiska ögonblicken på er stora dag.',
      icon: 'wedding',
      price: 'Från 12000 kr'
    },
    {
      id: 2,
      title: 'Porträtt',
      description: 'Professionella porträtt för privatpersoner och företag.',
      icon: 'portrait',
      price: '1500 kr/timme'
    },
    {
      id: 3,
      title: 'Event',
      description: 'Dokumentation av event, konserter och tillställningar.',
      icon: 'event',
      price: 'Offert efter behov'
    }
  ],
  testimonials: [
    {
      id: 1,
      name: 'Sara Johansson',
      role: 'Brud',
      text: 'Elena fångade vår bröllopsdag perfekt. Hon har ett otroligt öga för detaljer.',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'
    },
    {
      id: 2,
      name: 'Mikael Svensson',
      role: 'Porträttkund',
      text: 'Att arbeta med Elena var en fantastisk upplevelse. Hon har en unik förmåga att få dig att känna dig bekväm.',
      avatar: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a'
    }
  ],
  contact: {
    email: 'elena@photography.com',
    phone: '+46 70 123 45 67',
    address: 'Fotogatan 123, 111 22 Stockholm',
    hours: 'Måndag - Fredag: 9:00 - 18:00'
  },
  siteName: 'ANO Fotografi',
  siteDescription: 'Professionell fotograf specialiserad på porträtt, bröllop och evenemang',
  menuItems: [
    { id: 'home', text: 'Hem' },
    { id: 'about', text: 'Om mig' },
    { id: 'portfolio', text: 'Portfolio' },
    { id: 'services', text: 'Tjänster' },
    { id: 'testimonials', text: 'Omdömen' },
    { id: 'contact', text: 'Kontakt' }
  ]
}

// Create a wrapper to safely handle client-side data loading
function useSiteData(): [SiteData, (data: SiteData) => void] {
  // Always initialize with the default data on the server
  const [data, setData] = useState(defaultSiteData);
  
  // Use useEffect to handle client-side initialization
  useEffect(() => {
    if (isClient) {
      try {
        const storedData = localStorage.getItem('siteData');
        if (storedData) {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
    }
  }, []);
  
  // Create setter function that also updates localStorage
  const setDataWithStorage = (newData: SiteData) => {
    setData(newData);
    if (isClient) {
      try {
        localStorage.setItem('siteData', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save data to localStorage:', error);
      }
    }
  };
  
  return [data, setDataWithStorage];
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useSiteData();

  const updateHero = (data: HeroData) => {
    setSiteData({
      ...siteData,
      hero: data
    });
  }

  const updateAbout = (data: AboutData) => {
    setSiteData({
      ...siteData,
      about: data
    });
  }

  const updatePortfolio = (items: PortfolioItem[]) => {
    setSiteData({
      ...siteData,
      portfolio: items
    });
  }

  const updateServices = (items: ServiceItem[]) => {
    setSiteData({
      ...siteData,
      services: items
    });
  }

  const updateTestimonials = (items: TestimonialItem[]) => {
    setSiteData({
      ...siteData,
      testimonials: items
    });
  }

  const updateContact = (data: ContactData) => {
    setSiteData({
      ...siteData,
      contact: data
    });
  }

  const updateSiteInfo = (name: string, description: string) => {
    setSiteData({
      ...siteData,
      siteName: name,
      siteDescription: description
    });
  }

  const updateMenuItems = (items: MenuItem[]) => {
    setSiteData({
      ...siteData,
      menuItems: items
    });
  }

  return (
    <SiteContext.Provider value={{ 
      siteData, 
      updateHero, 
      updateAbout, 
      updatePortfolio, 
      updateServices, 
      updateTestimonials, 
      updateContact, 
      updateSiteInfo,
      updateMenuItems
    }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSiteContext() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error('useSiteContext måste användas inom en SiteProvider')
  }
  return context
} 