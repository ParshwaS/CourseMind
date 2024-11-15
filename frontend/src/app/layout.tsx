import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorker from '@/components/service/service';
import { AuthProvider } from '@/components/context/auth.context';
import Navbar from '@/components/custom/navbar'; // Ensure the path is correct

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CourseMind',
  description: 'CourseMind is a platform for assisting professors in creating and managing courses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ServiceWorker />
      <AuthProvider>
        <body className={inter.className}>
          <Navbar /> {/* Include Navbar at the top */}
          {children} {/* Render the rest of the page content */}
        </body>
      </AuthProvider>
    </html>
  );
}