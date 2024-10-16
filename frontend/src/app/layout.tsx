import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorker from '@/components/service/service'
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
