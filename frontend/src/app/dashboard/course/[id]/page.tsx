'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon, UploadIcon, FileIcon } from 'lucide-react'
import coursesService from "@/components/service/courses.service"

type File = {
  id: number;
  name: string;
  type: string;
}

type Module = {
  id: number;
  content: string;
}

type Chapter = {
  id: number;
  title: string;
  files: File[];
  quizzes: Module[];
  assignments: Module[];
}

export default function ChapterContent({ params }: { params: { id: string } }) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [courseName, setCourseName] = useState("")
  const [isNewChapterDialogOpen, setIsNewChapterDialogOpen] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState("")
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

  const addChapter = () => {
    if (newChapterTitle.trim()) {
      setChapters(prevChapters => [
        ...prevChapters,
        {
          id: Date.now(),
          title: newChapterTitle,
          files: [],
          quizzes: [],
          assignments: []
        }
      ]);
      setNewChapterTitle("");
      setIsNewChapterDialogOpen(false);
    }
  }

  const deleteChapter = (chapterIndex: number) => {
    setChapters(prevChapters => prevChapters.filter((_, index) => index !== chapterIndex));
  }

  const handleFileUpload = (chapterIndex: number, uploadedFiles: FileList) => {
    const file = uploadedFiles[0]; // Limit to the first file to prevent duplicates
    if (file) {
      setChapters(prevChapters => {
        const newChapters = [...prevChapters];
        const newFile = {
          id: Date.now(),
          name: file.name,
          type: file.type
        };
        newChapters[chapterIndex].files = [...newChapters[chapterIndex].files, newFile];
        return newChapters;
      });
    }
  }

  const deleteFile = (chapterIndex: number, fileId: number) => {
    setChapters(prevChapters => {
      const newChapters = [...prevChapters];
      newChapters[chapterIndex].files = newChapters[chapterIndex].files.filter(file => file.id !== fileId);
      return newChapters;
    });
  }

  const deleteModule = (chapterIndex: number, type: 'quizzes' | 'assignments', moduleId: number) => {
    setChapters(prevChapters => {
      const newChapters = [...prevChapters];
      newChapters[chapterIndex][type] = newChapters[chapterIndex][type].filter(module => module.id !== moduleId);
      return newChapters;
    });
  }

  const addQuiz = (chapterIndex: number) => {
    setChapters(prevChapters => {
      const newChapters = [...prevChapters];
      const newQuiz = {
        id: Date.now(),
        content: "New Quiz"
      };
      newChapters[chapterIndex].quizzes = [...newChapters[chapterIndex].quizzes, newQuiz];
      return newChapters;
    });
  }

  const addAssignment = (chapterIndex: number) => {
    setChapters(prevChapters => {
      const newChapters = [...prevChapters];
      const newAssignment = {
        id: Date.now(),
        content: "New Assignment"
      };
      newChapters[chapterIndex].assignments = [...newChapters[chapterIndex].assignments, newAssignment];
      return newChapters;
    });
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{courseName || "Loading..."}</h1>
        <Button onClick={() => setIsNewChapterDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Chapter
        </Button>
      </div>

      {chapters.map((chapter, chapterIndex) => (
        <Card key={chapter.id} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{chapter.title}</CardTitle>
            <Button variant="destructive" size="sm" onClick={() => deleteChapter(chapterIndex)}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Chapter
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
                  onChange={(e) => e.target.files && handleFileUpload(chapterIndex, e.target.files)}
                  multiple
                  aria-label="Upload files"
                />
              </div>
              <div className="mt-2">
                {chapter.files.map(file => (
                  <div key={file.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                    <span className="flex items-center">
                      <FileIcon className="h-4 w-4 mr-2" />
                      {file.name}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Open</Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteFile(chapterIndex, file.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
              <Button onClick={() => addQuiz(chapterIndex)} size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Quiz
              </Button>
              {chapter.quizzes.map(quiz => (
                <div key={quiz.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                  <span>{quiz.content}</span>
                  <Button variant="destructive" size="sm" onClick={() => deleteModule(chapterIndex, 'quizzes', quiz.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Assignments</h3>
              <Button onClick={() => addAssignment(chapterIndex)} size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Assignment
              </Button>
              {chapter.assignments.map(assignment => (
                <div key={assignment.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                  <span>{assignment.content}</span>
                  <Button variant="destructive" size="sm" onClick={() => deleteModule(chapterIndex, 'assignments', assignment.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isNewChapterDialogOpen} onOpenChange={setIsNewChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chapter</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="new-chapter">Chapter Title</Label>
            <Input
              id="new-chapter"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
            />
            <Button onClick={addChapter}>Create Chapter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
