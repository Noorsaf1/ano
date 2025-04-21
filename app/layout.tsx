import type { Metadata } from 'next'
import './globals.css'
import { SiteProvider } from './context/SiteContext'

export const metadata: Metadata = {
  title: 'ANO - Professionell Fotograf Portfolio',
  description: 'En ren, elegant webbplats för en professionell fotograf med en minimalistisk estetik.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: { url: '/favicon.svg', type: 'image/svg+xml' }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body>
        <SiteProvider>
          {children}
        </SiteProvider>
      </body>
    </html>
  )
} 