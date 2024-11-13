'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon, UploadIcon, FileIcon } from 'lucide-react'
import coursesService from "@/components/service/courses.service"
import modulesService from "@/components/service/modules.service"

type File = {
  id: number;
  name: string;
  type: string;
}

type Module = {
  id: number;
  title: string;
  files: File[];
  quizzes: { id: number; title: string }[];
  assignments: { id: number; title: string }[];
}

export default function ChapterContent({ params }: { params: { id: string } }) {
  const [modules, setModules] = useState<Module[]>([])
  const [courseName, setCourseName] = useState("")
  const [isNewModuleDialogOpen, setIsNewModuleDialogOpen] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [isNewQuizDialogOpen, setIsNewQuizDialogOpen] = useState(false)
  const [isNewAssignmentDialogOpen, setIsNewAssignmentDialogOpen] = useState(false)
  const [newQuizTitle, setNewQuizTitle] = useState("")
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("")
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const response = await coursesService.getById(params.id);
        if (response && response.course) {
          setCourseName(response.course.name);
        } else {
          console.error("Course data is missing or undefined:", response);
        }
      } catch (error) {
        console.error("Failed to fetch course name:", error);
      }
    };
    fetchCourseName();
  }, [params.id]);

  const addModule = async (courseId: string) => {
    if (newModuleTitle.trim()) {
      try {
        // Call the backend to create the module
        console.log(newModuleTitle, courseId);
        const newModule = await modulesService.create(newModuleTitle, courseId);
  
        if (newModule) {
          // Update local state with the new module returned from the backend
          setModules(prevModules => [
            ...prevModules,
            {
              id: newModule._id,
              title: newModule.name,
              files: [],
              quizzes: [],
              assignments: []
            }
          ]);
        }
  
        // Clear input and close the dialog
        setNewModuleTitle("");
        setIsNewModuleDialogOpen(false);
      } catch (error) {
        console.error("Failed to create module:", error);
        // Optionally, display an error to the user
      }
    }
  };

  const deleteModule = (moduleIndex: number) => {
    setModules(prevModules => prevModules.filter((_, index) => index !== moduleIndex));
  }

  const handleFileUpload = (moduleIndex: number, uploadedFiles: FileList) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      const newFiles = Array.from(uploadedFiles).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type
      }));
      newModules[moduleIndex].files = [...newModules[moduleIndex].files, ...newFiles];
      return newModules;
    });
  }

  const deleteFile = (moduleIndex: number, fileId: number) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex].files = newModules[moduleIndex].files.filter(file => file.id !== fileId);
      return newModules;
    });
  }

  const addQuiz = () => {
    if (newQuizTitle.trim() && activeModuleIndex !== null) {
      setModules(prevModules => {
        const newModules = [...prevModules];
        newModules[activeModuleIndex].quizzes.push({
          id: Date.now(),
          title: newQuizTitle,
        });
        return newModules;
      });
      setNewQuizTitle("");
      setIsNewQuizDialogOpen(false);
    }
  }

  const addAssignment = () => {
    if (newAssignmentTitle.trim() && activeModuleIndex !== null) {
      setModules(prevModules => {
        const newModules = [...prevModules];
        newModules[activeModuleIndex].assignments.push({
          id: Date.now(),
          title: newAssignmentTitle,
        });
        return newModules;
      });
      setNewAssignmentTitle("");
      setIsNewAssignmentDialogOpen(false);
    }
  }

  const deleteQuiz = (moduleIndex: number, quizId: number) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex].quizzes = newModules[moduleIndex].quizzes.filter(quiz => quiz.id !== quizId);
      return newModules;
    });
  }

  const deleteAssignment = (moduleIndex: number, assignmentId: number) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex].assignments = newModules[moduleIndex].assignments.filter(assignment => assignment.id !== assignmentId);
      return newModules;
    });
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{courseName || "Loading..."}</h1>
        <Button onClick={() => setIsNewModuleDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Module
        </Button>
      </div>

      {modules.map((module, moduleIndex) => (
        <Card key={module.id} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{module.title}</CardTitle>
            <Button variant="destructive" size="sm" onClick={() => deleteModule(moduleIndex)}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Module
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <div className="flex items-center space-x-2">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(moduleIndex, e.target.files)}
                  multiple
                  aria-label="Upload files"
                />
              </div>
              <div className="mt-2">
                {module.files.map(file => (
                  <div key={file.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                    <span className="flex items-center">
                      <FileIcon className="h-4 w-4 mr-2" />
                      {file.name}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Open</Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteFile(moduleIndex, file.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
              <Button 
                onClick={() => {
                  setActiveModuleIndex(moduleIndex);
                  setIsNewQuizDialogOpen(true);
                }} 
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Quiz
              </Button>
              <div className="mt-2">
                {module.quizzes.map(quiz => (
                  <div key={quiz.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                    <span>{quiz.title}</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Open</Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteQuiz(moduleIndex, quiz.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Assignments</h3>
              <Button 
                onClick={() => {
                  setActiveModuleIndex(moduleIndex);
                  setIsNewAssignmentDialogOpen(true);
                }} 
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Assignment
              </Button>
              <div className="mt-2">
                {module.assignments.map(assignment => (
                  <div key={assignment.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                    <span>{assignment.title}</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Open</Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteAssignment(moduleIndex, assignment.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isNewModuleDialogOpen} onOpenChange={setIsNewModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="new-module">Module Title</Label>
            <Input
              id="new-module"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
            />
            <Button onClick={() => addModule(params.id)}>Create Module</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewQuizDialogOpen} onOpenChange={setIsNewQuizDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="new-quiz">Quiz Title</Label>
            <Input
              id="new-quiz"
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
            />
            <Button onClick={addQuiz}>Create Quiz</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewAssignmentDialogOpen} onOpenChange={setIsNewAssignmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="new-assignment">Assignment Title</Label>
            <Input
              id="new-assignment"
              value={newAssignmentTitle}
              onChange={(e) => setNewAssignmentTitle(e.target.value)}
            />
            <Button onClick={addAssignment}>Create Assignment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}