'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSiteContext } from '../context/SiteContext'
import { uploadFile, deleteFile } from '../lib/fileUpload'
import { createObjectURL } from '../lib/client-utils'
import type { PortfolioItem, ServiceItem, TestimonialItem } from '../context/SiteContext'

// Notification component for success messages
function SuccessNotification({ message, onClose }: { message: string, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded shadow-lg flex items-center z-50">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
      <button 
        onClick={onClose} 
        className="ml-4 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
}

// Client-side only wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
        <div className="bg-primary p-8 shadow-md max-w-md w-full text-center">
          <h1 className="text-3xl font-serif mb-6">Laddar admin panel...</h1>
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function FileUploader({ 
  onFileSelect, 
  accept = "image/*", 
  label = "Släpp bilden här eller klicka för att välja fil",
  className = ""
}: { 
  onFileSelect: (file: File | FileList | null) => void, 
  accept?: string,
  label?: string,
  className?: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        onFileSelect(file)
      } else {
        alert('Vänligen välj en bildfil.')
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files)
    }
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div 
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-accent bg-accent/10' : 'border-subtle hover:border-accent/50'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileInputChange}
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
      <p className="mt-2 text-sm text-gray-600">{label}</p>
      <p className="text-xs text-gray-500 mt-1">Accepterade format: JPG, PNG, WebP</p>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('hero')
  const [loginError, setLoginError] = useState<string | null>(null)

  // Kontrollera om användaren redan är inloggad i localStorage
  useEffect(() => {
    // Endast körs på klientsidan
    if (typeof window !== 'undefined') {
      const loggedInState = localStorage.getItem('adminLoggedIn')
      if (loggedInState === 'true') {
        setIsLoggedIn(true)
      }
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Enkel autentisering med hårdkodat lösenord
    // I en produktion skulle detta hanteras mer säkert med kryptering och en backend
    if (password === 'ano123') {
      setIsLoggedIn(true)
      localStorage.setItem('adminLoggedIn', 'true')
      setLoginError(null)
    } else {
      setLoginError('Fel lösenord. Försök igen.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('adminLoggedIn')
  }

  return (
    <ClientOnly>
      {!isLoggedIn ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
          <div className="bg-primary p-8 shadow-md max-w-md w-full">
            <h1 className="text-3xl font-serif mb-6 text-center">Admin Inloggning</h1>
            {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block mb-2">Lösenord</label>
                <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-text text-primary py-2 px-4"
              >
                Logga in
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/" className="text-text underline">
                Tillbaka till hemsidan
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-secondary">
          <header className="bg-text text-primary p-4">
            <div className="container-custom flex justify-between items-center">
              <h1 className="text-2xl font-serif">Admin Panel</h1>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-primary hover:underline">
                  Visa webbplats
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-primary text-text px-4 py-2 text-sm"
                >
                  Logga ut
                </button>
              </div>
            </div>
          </header>

          <div className="container-custom py-8">
            <div className="bg-primary shadow-md">
              <div className="flex overflow-x-auto border-b border-subtle">
                {['hero', 'about', 'portfolio', 'services', 'testimonials', 'contact', 'settings'].map((tab) => (
                  <button 
                    key={tab}
                    className={`px-4 py-3 ${activeTab === tab ? 'border-b-2 border-accent' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'hero' && <HeroEditor />}
                {activeTab === 'about' && <AboutEditor />}
                {activeTab === 'portfolio' && <PortfolioEditor />}
                {activeTab === 'services' && <ServicesEditor />}
                {activeTab === 'testimonials' && <TestimonialsEditor />}
                {activeTab === 'contact' && <ContactEditor />}
                {activeTab === 'settings' && <SettingsEditor />}
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientOnly>
  )
}

// Hero sektion editor
function HeroEditor() {
  const { siteData, updateHero } = useSiteContext()
  const [heading, setHeading] = useState(siteData?.hero?.heading || '')
  const [tagline, setTagline] = useState(siteData?.hero?.tagline || '')
  const [image, setImage] = useState(siteData?.hero?.image || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)

  const handleFileSelect = (file: File | FileList | null) => {
    if (!file) {
      console.error("No file received in handleFileSelect");
      return;
    }
    
    const selectedFile = file instanceof File ? file : file.length > 0 ? file[0] : null;
    if (!selectedFile) {
      console.error("No valid file found");
      return;
    }
    
    setSelectedFile(selectedFile)
    console.log(`File selected: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size} bytes`);
    
    // Use the safe utility for creating object URLs
    const objectUrl = createObjectURL(selectedFile)
    if (objectUrl) {
      setPreviewUrl(objectUrl)
      console.log("Preview URL created successfully");
    } else {
      console.error("Failed to create preview URL");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)
    
    let imageUrl = image;
    
    if (selectedFile) {
      try {
        const uploadedUrl = await uploadFile(selectedFile, 'ano')
        
        if (!uploadedUrl) {
          setUploadError('Kunde inte ladda upp bilden. Försök igen.')
          setIsUploading(false)
          return;
        }
        
        imageUrl = uploadedUrl;
      } catch (error) {
        console.error('Error uploading file:', error)
        setUploadError(`Ett fel uppstod vid uppladdningen: ${error instanceof Error ? error.message : 'Okänt fel'}`)
        setIsUploading(false)
        return;
      }
    }
    
    // Uppdatera hero-data i kontext
    updateHero({
      heading,
      tagline,
      image: imageUrl
    })
    
    setIsUploading(false)
    setSuccessNotification('Hero-sektionen har sparats och kommer att visas direkt på webbplatsen!')
  }

  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Redigera Hero-sektion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hero-heading" className="block mb-1">Rubrik</label>
          <input 
            type="text" 
            id="hero-heading" 
            value={heading} 
            onChange={(e) => setHeading(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        <div>
          <label htmlFor="hero-tagline" className="block mb-1">Tagline</label>
          <input 
            type="text" 
            id="hero-tagline" 
            value={tagline} 
            onChange={(e) => setTagline(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        <div>
          <label className="block mb-1">Ladda upp bakgrundsbild</label>
          <FileUploader 
            onFileSelect={handleFileSelect}
            label="Dra och släpp herobildsfilen här eller klicka för att välja fil"
          />
        </div>
        <div>
          <label htmlFor="hero-image" className="block mb-1">Eller använd bild-URL</label>
          <input 
            type="text" 
            id="hero-image" 
            value={image} 
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        
        {uploadError && (
          <div className="text-red-500 text-sm">{uploadError}</div>
        )}
        
        <button 
          type="submit" 
          className="bg-text text-primary py-2 px-6 relative"
          disabled={isUploading}
        >
          {isUploading ? 'Laddar upp...' : 'Spara ändringar'}
          {isUploading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 bg-subtle">
        <h3 className="font-medium mb-2">Förhandsgranskning</h3>
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-text/40"></div>
          <img 
            src={previewUrl || image} 
            alt="Hero preview" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
            <h1 className="text-2xl font-serif tracking-wider">{heading}</h1>
            <p className="mt-2">{tagline}</p>
          </div>
        </div>
      </div>

      {successNotification && (
        <SuccessNotification message={successNotification} onClose={() => setSuccessNotification(null)} />
      )}
    </div>
  )
}

// Om mig sektion editor
function AboutEditor() {
  const { siteData, updateAbout } = useSiteContext()
  const [title, setTitle] = useState(siteData.about.title)
  const [bio, setBio] = useState(siteData.about.bio)
  const [image, setImage] = useState(siteData.about.image)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)

  const handleFileSelect = (file: File | FileList | null) => {
    if (!file) {
      console.error("No file received in handleFileSelect");
      return;
    }
    
    const selectedFile = file instanceof File ? file : file.length > 0 ? file[0] : null;
    if (!selectedFile) {
      console.error("No valid file found");
      return;
    }
    
    setSelectedFile(selectedFile)
    
    // Use the safe utility for creating object URLs
    const objectUrl = createObjectURL(selectedFile)
    if (objectUrl) {
      setPreviewUrl(objectUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)
    
    let imageUrl = image;
    
    if (selectedFile) {
      try {
        const uploadedUrl = await uploadFile(selectedFile, 'ano')
        
        if (!uploadedUrl) {
          setUploadError('Kunde inte ladda upp bilden. Försök igen.')
          setIsUploading(false)
          return;
        }
        
        imageUrl = uploadedUrl;
      } catch (error) {
        console.error('Error uploading file:', error)
        setUploadError(`Ett fel uppstod vid uppladdningen: ${error instanceof Error ? error.message : 'Okänt fel'}`)
        setIsUploading(false)
        return;
      }
    }
    
    // Uppdatera about-data i kontext
    updateAbout({
      title,
      bio,
      image: imageUrl
    })
    
    setIsUploading(false)
    setSuccessNotification('Om mig-sektionen har sparats och kommer att visas direkt på webbplatsen!')
  }

  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Redigera Om mig-sektion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="about-title" className="block mb-1">Rubrik</label>
          <input 
            type="text" 
            id="about-title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        <div>
          <label htmlFor="about-bio" className="block mb-1">Biografi</label>
          <textarea 
            id="about-bio" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            className="w-full p-2 border border-subtle"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Ladda upp profilbild</label>
          <FileUploader 
            onFileSelect={handleFileSelect}
            label="Dra och släpp profilbilden här eller klicka för att välja fil"
          />
        </div>
        <div>
          <label htmlFor="about-image" className="block mb-1">Eller använd bild-URL</label>
          <input 
            type="text" 
            id="about-image" 
            value={image} 
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        
        {uploadError && (
          <div className="text-red-500 text-sm">{uploadError}</div>
        )}
        
        <div className="flex items-start gap-4 mt-4">
          <div className="flex-shrink-0 w-24 h-24 bg-subtle relative">
            <img 
              src={previewUrl || image} 
              alt="Förhandsgranskning av profilbild" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="text-sm font-medium">Förhandsgranskning</p>
            <p className="text-xs text-gray-500">Se hur bilden ser ut</p>
          </div>
        </div>
        <button 
          type="submit" 
          className="bg-text text-primary py-2 px-6 relative"
          disabled={isUploading}
        >
          {isUploading ? 'Laddar upp...' : 'Spara ändringar'}
          {isUploading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
        </button>
      </form>
      
      {successNotification && (
        <SuccessNotification message={successNotification} onClose={() => setSuccessNotification(null)} />
      )}
    </div>
  )
}

// Portfolio editor (mer komplex)
function PortfolioEditor() {
  const { siteData, updatePortfolio } = useSiteContext()
  const [items, setItems] = useState(siteData.portfolio)
  
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('portraits')
  const [newImage, setNewImage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)
  
  const handleFileSelect = (file: File | FileList | null) => {
    if (!file) {
      console.error("No file received in handleFileSelect");
      return;
    }
    
    const selectedFile = file instanceof File ? file : file.length > 0 ? file[0] : null;
    if (!selectedFile) {
      console.error("No valid file found");
      return;
    }
    
    setSelectedFile(selectedFile)
    console.log(`File selected: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size} bytes`);
    
    // Use the safe utility for creating object URLs
    const objectUrl = createObjectURL(selectedFile)
    if (objectUrl) {
      setPreviewUrl(objectUrl)
      console.log("Preview URL created successfully");
    } else {
      console.error("Failed to create preview URL");
    }
  }
  
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)
    
    let imageSource = newImage
    
    // Om en fil har valts, ladda upp den till Supabase
    if (selectedFile) {
      try {
        const uploadedUrl = await uploadFile(selectedFile, 'ano')
        if (!uploadedUrl) {
          setUploadError('Kunde inte ladda upp filen. Försök igen.')
          setIsUploading(false)
          return
        }
        imageSource = uploadedUrl
      } catch (error) {
        console.error('Error uploading file:', error)
        setUploadError('Ett fel uppstod vid uppladdningen. Försök igen.')
        setIsUploading(false)
        return
      }
    }
    
    if (!imageSource) {
      setUploadError('Vänligen lägg till en bild genom att ladda upp en fil eller ange en URL.')
      setIsUploading(false)
      return
    }
    
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
      title: newTitle,
      category: newCategory,
      image: imageSource
    }
    
    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    updatePortfolio(updatedItems)
    
    setNewTitle('')
    setNewImage('')
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsUploading(false)
    
    // Återställ file input
    const fileInput = document.getElementById('portfolio-image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
    
    setSuccessNotification('Nytt projekt har lagts till och kommer visas direkt på webbplatsen!')
  }
  
  const handleRemoveItem = async (id: number) => {
    const itemToRemove = items.find(item => item.id === id)
    
    // Om bilden är en Supabase-URL (börjar med din Supabase URL), ta bort filen
    if (itemToRemove && itemToRemove.image.includes('supabase')) {
      try {
        await deleteFile(itemToRemove.image, 'ano')
      } catch (error) {
        console.error('Error deleting file:', error)
        // Fortsätt ändå att ta bort från listan, även om filborttagning misslyckas
      }
    }
    
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
    updatePortfolio(updatedItems)
    
    setSuccessNotification('Projektet har tagits bort och ändringen visas direkt på webbplatsen!')
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Hantera Portfolio</h2>
      
      <div className="mb-8">
        <h3 className="text-xl mb-4">Lägg till nytt projekt</h3>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="new-title" className="block mb-1">Titel</label>
            <input 
              type="text" 
              id="new-title" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border border-subtle"
              required
            />
          </div>
          <div>
            <label htmlFor="new-category" className="block mb-1">Kategori</label>
            <select
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border border-subtle"
            >
              <option value="portraits">Porträtt</option>
              <option value="weddings">Bröllop</option>
              <option value="nature">Natur</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Ladda upp bild</label>
            <FileUploader 
              onFileSelect={handleFileSelect}
              label="Dra och släpp projektbilden här eller klicka för att välja fil"
            />
          </div>
          <div>
            <label htmlFor="new-image" className="block mb-1">Eller använd bild-URL</label>
            <input 
              type="text" 
              id="new-image" 
              value={newImage} 
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full p-2 border border-subtle"
            />
          </div>
          
          {uploadError && (
            <div className="text-red-500 text-sm">{uploadError}</div>
          )}
          
          {(previewUrl || newImage) && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 h-24 bg-subtle relative">
                <img 
                  src={previewUrl || newImage} 
                  alt="Förhandsgranskning" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="text-sm font-medium">Förhandsgranskning</p>
                <p className="text-xs text-gray-500">Se hur bilden ser ut</p>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="bg-text text-primary py-2 px-6 relative"
            disabled={isUploading}
          >
            {isUploading ? 'Laddar upp...' : 'Lägg till projekt'}
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl mb-4">Existerande projekt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="border border-subtle p-4 flex">
              <div className="flex-shrink-0 w-24 h-24 mr-4 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm mb-2">Kategori: {item.category}</p>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-sm text-red-500"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {successNotification && (
        <SuccessNotification message={successNotification} onClose={() => setSuccessNotification(null)} />
      )}
    </div>
  )
}

// Tjänster editor
function ServicesEditor() {
  const { siteData, updateServices } = useSiteContext()
  const [services, setServices] = useState(siteData.services)
  
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newIcon, setNewIcon] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)
  
  const handleFileSelect = (file: File | FileList | null) => {
    if (!file) {
      console.error("No file received in handleFileSelect");
      return;
    }
    
    const selectedFile = file instanceof File ? file : file.length > 0 ? file[0] : null;
    if (!selectedFile) {
      console.error("No valid file found");
      return;
    }
    
    setSelectedFile(selectedFile)
    console.log(`Service icon selected: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size} bytes`);
    
    // Use the safe utility for creating object URLs
    const objectUrl = createObjectURL(selectedFile)
    if (objectUrl) {
      setPreviewUrl(objectUrl)
      console.log("Service icon preview URL created successfully");
    } else {
      console.error("Failed to create service icon preview URL");
    }
  }
  
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)
    
    let iconToUse = newIcon
    
    if (selectedFile) {
      try {
        const uploadedUrl = await uploadFile(selectedFile, 'ano');
        
        if (!uploadedUrl) {
          setUploadError('Kunde inte ladda upp ikonen. Försök igen.');
          setIsUploading(false);
          return;
        }
        
        iconToUse = uploadedUrl;
      } catch (error) {
        console.error('Error uploading icon:', error);
        setUploadError(`Ett fel uppstod vid uppladdningen: ${error instanceof Error ? error.message : 'Okänt fel'}`);
        setIsUploading(false);
        return;
      }
    }
    
    const newService = {
      id: services.length > 0 ? Math.max(...services.map(service => service.id)) + 1 : 1,
      title: newTitle,
      description: newDescription,
      icon: iconToUse || 'default'
    }
    
    const updatedServices = [...services, newService]
    setServices(updatedServices)
    updateServices(updatedServices)
    
    setNewTitle('')
    setNewDescription('')
    setNewIcon('')
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsUploading(false)
    
    setSuccessNotification('Ny tjänst har lagts till och kommer visas direkt på webbplatsen!')
  }
  
  const handleRemoveService = async (id: number) => {
    const serviceToRemove = services.find(service => service.id === id)
    
    // Om ikonen är en Supabase-URL, ta bort filen
    if (serviceToRemove && serviceToRemove.icon.includes('supabase')) {
      try {
        await deleteFile(serviceToRemove.icon, 'ano');
      } catch (error) {
        console.error('Error deleting service icon:', error);
        // Fortsätt ändå att ta bort från listan
      }
    }
    
    const updatedServices = services.filter(service => service.id !== id)
    setServices(updatedServices)
    updateServices(updatedServices)
    
    setSuccessNotification('Tjänsten har tagits bort och ändringen visas direkt på webbplatsen!')
  }
  
  const iconOptions = [
    { value: 'wedding', label: 'Bröllop' },
    { value: 'portrait', label: 'Porträtt' },
    { value: 'event', label: 'Event' },
    { value: 'family', label: 'Familj' },
    { value: 'product', label: 'Produkt' },
    { value: 'custom', label: 'Anpassad bild' }
  ]
  
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Hantera Tjänster</h2>
      
      <div className="mb-8">
        <h3 className="text-xl mb-4">Lägg till ny tjänst</h3>
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label htmlFor="service-title" className="block mb-1">Titel</label>
            <input 
              type="text" 
              id="service-title" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border border-subtle"
              required
            />
          </div>
          <div>
            <label htmlFor="service-description" className="block mb-1">Beskrivning</label>
            <textarea 
              id="service-description" 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-2 border border-subtle"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="service-icon" className="block mb-1">Ikon</label>
            <select
              id="service-icon"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="w-full p-2 border border-subtle"
            >
              <option value="">Välj ikon</option>
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {newIcon === 'custom' && (
            <div>
              <label className="block mb-1">Egen ikon/bild</label>
              <FileUploader 
                onFileSelect={handleFileSelect}
                label="Dra och släpp ikonen här eller klicka för att välja fil"
              />
              
              {previewUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img 
                    src={previewUrl} 
                    alt="Förhandsgranskning" 
                    className="w-12 h-12 object-contain border border-subtle" 
                  />
                  <span className="text-sm text-gray-500">Förhandsgranskning</span>
                </div>
              )}
            </div>
          )}
          
          {uploadError && (
            <div className="text-red-500 text-sm">{uploadError}</div>
          )}
          
          <button 
            type="submit" 
            className="bg-text text-primary py-2 px-6 relative"
            disabled={isUploading}
          >
            {isUploading ? 'Laddar upp...' : 'Lägg till tjänst'}
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl mb-4">Existerande tjänster</h3>
        <div className="space-y-4">
          {services.map(service => (
            <div key={service.id} className="border border-subtle p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 mr-4 bg-subtle flex items-center justify-center">
                  {service.icon.startsWith('http') || service.icon.startsWith('blob:') ? (
                    <img src={service.icon} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <span>{service.icon}</span>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{service.title}</h4>
                  <p className="text-sm mb-2">{service.description}</p>
                  <button 
                    onClick={() => handleRemoveService(service.id)}
                    className="text-sm text-red-500"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {successNotification && (
        <SuccessNotification message={successNotification} onClose={() => setSuccessNotification(null)} />
      )}
    </div>
  )
}

// Omdömen editor
function TestimonialsEditor() {
  const { siteData, updateTestimonials } = useSiteContext()
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(siteData?.testimonials || [])
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newText, setNewText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)

  const handleFileSelect = (file: File | FileList | null) => {
    if (!file) {
      console.error('No file received in handleFileSelect')
      return
    }
    
    const selectedFile = file instanceof File ? file : file.length > 0 ? file[0] : null
    if (!selectedFile) {
      console.error('No valid file found')
      return
    }
    
    setSelectedFile(selectedFile)
    console.log(`File selected: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size} bytes`)
    
    // Create a preview URL for the selected file
    const objectUrl = createObjectURL(selectedFile)
    if (objectUrl) {
      setPreviewUrl(objectUrl)
      console.log('Preview URL created successfully')
    } else {
      console.error('Failed to create preview URL')
    }
  }
  
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)
    
    try {
      if (!newName || !newRole || !newText) {
        setError('Vänligen fyll i alla obligatoriska fält')
        setIsUploading(false)
        return
      }

      let avatarUrl = ''
      if (selectedFile) {
        // Upload to Supabase or similar service in a real implementation
        try {
          const uploadedUrl = await uploadFile(selectedFile, 'ano')
          if (!uploadedUrl) {
            setError('Kunde inte ladda upp bilden. Kontrollera konsolen för detaljer.')
            setIsUploading(false)
            return
          }
          avatarUrl = uploadedUrl
        } catch (error) {
          console.error('Error uploading file:', error)
          setError(`Ett fel uppstod vid uppladdningen: ${error instanceof Error ? error.message : 'Okänt fel'}`)
          setIsUploading(false)
          return
        }
      }

      const newId = testimonials.length > 0 
        ? Math.max(...testimonials.map(item => item.id)) + 1 
        : 1

      const newTestimonial: TestimonialItem = {
        id: newId,
        name: newName,
        role: newRole,
        text: newText,
        avatar: avatarUrl
      }

      const updatedTestimonials = [...testimonials, newTestimonial]
      setTestimonials(updatedTestimonials)
      updateTestimonials(updatedTestimonials)
      
      // Reset form
      setNewName('')
      setNewRole('')
      setNewText('')
      setSelectedFile(null)
      setPreviewUrl(null)
      setIsUploading(false)
      setSuccessNotification('Nytt omdöme har lagts till och kommer visas direkt på webbplatsen!')
    } catch (error) {
      console.error('Error adding testimonial:', error)
      setError(`Ett fel uppstod: ${error instanceof Error ? error.message : 'Okänt fel'}`)
      setIsUploading(false)
    }
  }

  const handleRemoveTestimonial = async (id: number) => {
    try {
      const testimonialToRemove = testimonials.find(item => item.id === id)
      if (!testimonialToRemove) {
        console.error(`Testimonial with ID ${id} not found`)
        return
      }
      
      if (testimonialToRemove.avatar && testimonialToRemove.avatar.includes('supabase')) {
        console.log(`Deleting avatar from Supabase: ${testimonialToRemove.avatar}`)
        try {
          await deleteFile(testimonialToRemove.avatar, 'ano')
        } catch (error) {
          console.error('Error deleting avatar:', error)
          // Continue removing from the list even if file deletion fails
        }
      }

      const updatedTestimonials = testimonials.filter(item => item.id !== id)
      setTestimonials(updatedTestimonials)
      updateTestimonials(updatedTestimonials)
      setSuccessNotification('Omdömet har tagits bort och ändringen visas direkt på webbplatsen!')
    } catch (error) {
      console.error('Error removing testimonial:', error)
      setError(`Ett fel uppstod när omdömet skulle tas bort: ${error instanceof Error ? error.message : 'Okänt fel'}`)
    }
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Hantera Omdömen</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl mb-4">Lägg till nytt omdöme</h3>
        <form onSubmit={handleAddTestimonial} className="space-y-4">
          <div>
            <label htmlFor="new-name" className="block mb-1">Namn</label>
            <input 
              type="text" 
              id="new-name" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-subtle"
              required
            />
          </div>
          <div>
            <label htmlFor="new-role" className="block mb-1">Roll</label>
            <input 
              type="text" 
              id="new-role" 
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-2 border border-subtle"
              required
            />
          </div>
          <div>
            <label htmlFor="new-text" className="block mb-1">Omdöme</label>
            <textarea 
              id="new-text" 
              value={newText} 
              onChange={(e) => setNewText(e.target.value)}
              className="w-full p-2 border border-subtle"
              rows={4}
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-1">Profilbild (valfritt)</label>
            <FileUploader onFileSelect={handleFileSelect} />
            
            {previewUrl && (
              <div className="flex items-start gap-4 mt-2">
                <div className="flex-shrink-0 w-12 h-12 bg-subtle relative">
                  <img 
                    src={previewUrl} 
                    alt="Förhandsgranskning" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Förhandsgranskning</p>
                  <p className="text-xs text-gray-500">Profilbild för omdömet</p>
                </div>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="bg-text text-primary py-2 px-6 relative"
            disabled={isUploading}
          >
            {isUploading ? 'Laddar upp...' : 'Lägg till omdöme'}
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl mb-4">Existerande omdömen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="border p-4 rounded flex gap-4">
              {testimonial.avatar && (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <blockquote className="italic mb-2">"{testimonial.text}"</blockquote>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <button 
                  onClick={() => handleRemoveTestimonial(testimonial.id)}
                  className="mt-2 text-red-600 text-sm"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {successNotification && (
        <SuccessNotification 
          message={successNotification} 
          onClose={() => setSuccessNotification(null)} 
        />
      )}
    </div>
  )
}

// Kontakt editor
function ContactEditor() {
  const { siteData, updateContact } = useSiteContext()
  const [email, setEmail] = useState(siteData.contact.email)
  const [phone, setPhone] = useState(siteData.contact.phone)
  const [address, setAddress] = useState(siteData.contact.address)
  const [hours, setHours] = useState(siteData.contact.hours)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    updateContact({
      email,
      phone,
      address,
      hours
    })
    
    setSuccessNotification('Kontaktinformationen har uppdaterats och ändringen visas direkt på webbplatsen!')
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Redigera Kontaktinformation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-email" className="block mb-1">E-post</label>
          <input 
            type="email" 
            id="contact-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block mb-1">Telefon</label>
          <input 
            type="text" 
            id="contact-phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        <div>
          <label htmlFor="contact-address" className="block mb-1">Adress</label>
          <input 
            type="text" 
            id="contact-address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        <div>
          <label htmlFor="contact-hours" className="block mb-1">Öppettider</label>
          <input 
            type="text" 
            id="contact-hours" 
            value={hours} 
            onChange={(e) => setHours(e.target.value)}
            className="w-full p-2 border border-subtle"
          />
        </div>
        <button type="submit" className="bg-text text-primary py-2 px-6">
          Spara ändringar
        </button>
      </form>
      
      {successNotification && (
        <SuccessNotification message={successNotification} onClose={() => setSuccessNotification(null)} />
      )}
    </div>
  )
}

// Inställningar editor
function SettingsEditor() {
  const { siteData, updateSiteInfo, updateMenuItems } = useSiteContext()
  const [siteName, setSiteName] = useState(siteData.siteName)
  const [siteDescription, setSiteDescription] = useState(siteData.siteDescription)
  const [menuItems, setMenuItems] = useState(siteData.menuItems)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSiteInfo(siteName, siteDescription)
    updateMenuItems(menuItems)
    setSuccessNotification('Inställningarna har sparats och ändringarna visas direkt på webbplatsen!')
  }

  const handleMenuTextChange = (id: string, newText: string) => {
    setMenuItems(current => 
      current.map(item => 
        item.id === id ? { ...item, text: newText } : item
      )
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Sidinställningar</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">Grundinformation</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Webbplatsens namn</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Beskrivning</label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">Menytexter</h3>
          {menuItems.map(item => (
            <div key={item.id} className="mb-4">
              <label className="block text-gray-700 mb-2">{item.id.charAt(0).toUpperCase() + item.id.slice(1)}</label>
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleMenuTextChange(item.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">Webbplatsens färger</h3>
          <p className="text-sm text-gray-500 mb-4">
            Färginställningar kommer i nästa version av administratörspanelen.
          </p>
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Spara inställningar
        </button>
      </form>
      
      {successNotification && (
        <SuccessNotification message={successNotification} onClose={() => setSuccessNotification(null)} />
      )}
    </div>
  )
} 