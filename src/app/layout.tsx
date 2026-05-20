import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mise — Recipe Cookbook',
  description: 'Your personal recipe cookbook',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
        <body>
          {children}
          <Toaster position="bottom-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
