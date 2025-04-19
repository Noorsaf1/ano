import type { Metadata } from 'next'
import './globals.css'
import { SiteProvider } from './context/SiteContext'

export const metadata: Metadata = {
  title: 'Professionell Fotograf Portfolio',
  description: 'En ren, elegant webbplats för en professionell fotograf med en minimalistisk estetik.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body>
        <SiteProvider>
          {children}
        </SiteProvider>
      </body>
    </html>
  )
} 