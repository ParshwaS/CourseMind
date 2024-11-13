"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Book } from "lucide-react"
import coursesService from "@/components/service/courses.service"
import { useRouter } from "next/navigation";
// Types for our data structures
type Module = {
  _id: string
  name: string
}

type Course = {
  _id: string
  name: string
  modules: Module[]
}

export default function ProfessorDashboard() {
  // Mock data for initial courses
  const [courses, setCourses] = useState<Course[]>([])

  const router = useRouter()

  const [newCourseName, setNewCourseName] = useState("")

  useEffect(() => {
    coursesService.get().then((data) => {
      setCourses(data)
    })
  }, [])

  const addCourse = () => {
    if (newCourseName.trim() !== "") {
      coursesService.create(newCourseName).then((data) => {
        coursesService.get().then((data) => {
          setCourses(data)
        })
        setNewCourseName("")
      })
    }
    else {
      alert("Course name cannot be empty!\nPlease enter a valid course name."); 
    }
  }

const deleteCourse = (id: string) => {
    coursesService.delete(id).then(() => {
        setCourses(courses.filter(course => course._id !== id));
    }).catch((error) => {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course. Please try again.");
    });
};

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
          <Card key={course._id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.modules.length} modules</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {router.push("/dashboard/course/"+course._id)}}>
                <Book className="mr-2 h-4 w-4" /> View Modules
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