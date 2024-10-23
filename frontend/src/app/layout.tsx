import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorker from '@/components/service/service'
import { AuthProvider } from '@/components/context/auth.context'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CourseMind',
  description: 'CourseMind is a platform for assisting professors in creating and managing courses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ServiceWorker />
      <AuthProvider>
        <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  )
}
