import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function IntroPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="text-2xl font-bold">CourseMind</span>
          </div>
          <nav>
            <Button variant="secondary" className="mr-2" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to CourseMind</h1>
        <div className="max-w-2xl mx-auto text-center">
          <p className="mb-6">
            CourseMind is an intuitive platform designed for educators to create and manage course assignments and quizzes effortlessly. Leveraging AI, it allows professors to transform their lecture notes into dynamic assessments and organized course materials.
          </p>
          <p className="mb-6">
            The platform promotes structured course management by categorizing materials into modules, chapters, and assignments, displayed neatly on a user-friendly dashboard.
          </p>
          <div className="mt-8">
            <Button size="lg" className="mr-4" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-muted text-muted-foreground p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 CourseMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}