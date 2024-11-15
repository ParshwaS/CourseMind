import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const courses = [
  { id: 1, title: "Introduction to React" },
  { id: 2, title: "Advanced JavaScript" },
  { id: 3, title: "Next.js Fundamentals" },
]

export default function CourseList() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <div className="space-x-2">
          <Button variant="outline">Create New Course</Button>
          <Button variant="destructive">Delete Courses</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p>Course ID: {course.id}</p>
              <Link href={`/courses/${course.id}`} passHref>
                <Button>Enter Course</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}