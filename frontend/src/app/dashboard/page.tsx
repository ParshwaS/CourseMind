'use client'

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Trash2, Book } from 'lucide-react'
import { useRouter } from "next/navigation"
import coursesService from "@/components/service/courses.service"
import { error } from "console"

type Module = {
  _id: string
  name: string
}

type Course = {
  _id: string
  name: string
  moduleId: Module[]
}

export default function Dashboard() {

  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourseName, setNewCourseName] = useState("")

  useEffect(() => {
    coursesService.get().then((data) => {
      setCourses(data)
    })
  }, [])

  const addCourse = () => {
    if ( newCourseName !== "") {
      coursesService.create(newCourseName.trim())
      .then(() => {
        coursesService.get()
        .then((data) => {
          setCourses(data);
        });
        setNewCourseName("")
      });
    }
  }

  const deleteCourse = useCallback(async (id: string) => {
    try {
      // Check if the course exists in the backend before making the API call
      const courseExists = courses.find(course => course._id === id);
      if (!courseExists) {
        console.warn(`Course with ID ${id} not found in state`);
        return;
      }
  
      await coursesService.delete(id);
  
      // Update the state after successful deletion
      setCourses(prevCourses => prevCourses.filter(course => course._id !== id));
      console.log("Course deleted:", id);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  }, [courses]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
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
          <Card key={course._id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.moduleId.length} modules</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/dashboard/course/${course._id}`)}>
                <Book className="mr-2 h-4 w-4" /> View Course
              </Button>
              <Button variant="destructive" onClick={() => deleteCourse(course._id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}