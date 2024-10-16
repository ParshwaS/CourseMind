import Link from 'next/link'
import { Button } from "@/components/ui/button"

const chapters = [
  { id: 1, title: "Chapter 1: Introduction" },
  { id: 2, title: "Chapter 2: Basics" },
  { id: 3, title: "Chapter 3: Advanced Concepts" },
  { id: 4, title: "Chapter 4: Best Practices" },
  { id: 5, title: "Chapter 5: Conclusion" },
]

export default function CoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Course {params.id}</h1>
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="flex justify-between items-center p-4 bg-white shadow rounded">
            <h2 className="text-xl">{chapter.title}</h2>
            <Link href={`/courses/${params.id}/chapters/${chapter.id}`} passHref>
              <Button>Select</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}