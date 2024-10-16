"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Book } from "lucide-react"
// Types for our data structures
type Module = {
  id: string
  name: string
}

type Course = {
  id: string
  name: string
  modules: Module[]
}

export default function ProfessorDashboard() {
  // Mock data for initial courses
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Introduction to Computer Science", modules: [{ id: "1", name: "Basic Programming" }, { id: "2", name: "Data Structures" }] },
    { id: "2", name: "Web Development", modules: [{ id: "1", name: "HTML & CSS" }, { id: "2", name: "JavaScript Basics" }] },
  ])

  const [newCourseName, setNewCourseName] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const addCourse = () => {
    if (newCourseName.trim() !== "") {
      const newCourse: Course = {
        id: (courses.length + 1).toString(),
        name: newCourseName,
        modules: []
      }
      setCourses([...courses, newCourse])
      setNewCourseName("")
    }
  }

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Professor Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          type="text"
          placeholder="New course name"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={addCourse}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>Course ID: {course.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{course.modules.length} modules</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedCourse(course)}>
                    <Book className="mr-2 h-4 w-4" /> View Modules
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedCourse?.name} Modules</DialogTitle>
                    <DialogDescription>List of modules for this course</DialogDescription>
                  </DialogHeader>
                  <ul className="mt-4">
                    {selectedCourse?.modules.map((module) => (
                      <li key={module.id} className="mb-2">{module.name}</li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={() => deleteCourse(course.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}