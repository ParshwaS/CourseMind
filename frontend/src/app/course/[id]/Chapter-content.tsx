'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, TrashIcon, UploadIcon, PencilIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Module = {
  id: number;
  content: string;
}

type File = {
  id: number;
  name: string;
  type: string;
}

type Session = {
  title: string;
  modules: Module[];
}

export default function ChapterContent({ params }: { params: { id: string, chapterId: string } }) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      title: 'Notes',
      modules: [
        { id: 1, content: 'Introduction to the topic' },
        { id: 2, content: 'Key concepts and definitions' },
        { id: 3, content: 'Examples and applications' }
      ]
    },
    {
      title: 'Assignments',
      modules: [
        { id: 1, content: 'Research paper on the main topic' },
        { id: 2, content: 'Problem set related to key concepts' },
        { id: 3, content: 'Group project proposal' }
      ]
    },
    {
      title: 'Quizzes',
      modules: [
        { id: 1, content: 'Multiple choice quiz on basic concepts' },
        { id: 2, content: 'Short answer quiz on applications' },
        { id: 3, content: 'Comprehensive final quiz' }
      ]
    },
  ])

  const [files, setFiles] = useState<File[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<{ sessionIndex: number, moduleId: number, content: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addModule = (sessionIndex: number) => {
    setSessions(prevSessions => {
      const newSessions = [...prevSessions]
      const newModule = { id: Date.now(), content: `New ${newSessions[sessionIndex].title.slice(0, -1)} ${Date.now()}` }
      newSessions[sessionIndex].modules.push(newModule)
      return newSessions
    })
  }

  const deleteModule = (sessionIndex: number, moduleId: number) => {
    setSessions(prevSessions => {
      const newSessions = [...prevSessions]
      newSessions[sessionIndex].modules = newSessions[sessionIndex].modules.filter(module => module.id !== moduleId)
      return newSessions
    })
  }

  const editModule = (sessionIndex: number, moduleId: number, newContent: string) => {
    setSessions(prevSessions => {
      const newSessions = [...prevSessions]
      const moduleIndex = newSessions[sessionIndex].modules.findIndex(module => module.id === moduleId)
      if (moduleIndex !== -1) {
        newSessions[sessionIndex].modules[moduleIndex].content = newContent
      }
      return newSessions
    })
    setEditingModule(null)
  }

  const handleFileUpload = (uploadedFiles: FileList) => {
    const newFiles = Array.from(uploadedFiles).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type
    }))
    setFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const deleteFile = (fileId: number) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId))
  }

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Course {params.id} - Chapter {params.chapterId}</h1>
      {sessions.map((session, sessionIndex) => (
        <Card key={session.title} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{session.title}</CardTitle>
            <Button onClick={() => addModule(sessionIndex)} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </CardHeader>
          <CardContent>
            {session.modules.map(module => (
              <div key={module.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                <span>{module.content}</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingModule({ sessionIndex, moduleId: module.id, content: module.content })}>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteModule(sessionIndex, module.id)}>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {session.title === 'Notes' && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>File Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                    <Button onClick={triggerFileUpload} variant="outline">
                      Upload More
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files)
                      }
                    }}
                    multiple
                  />
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                      </DialogHeader>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file-upload">Select files</Label>
                        <Input
                          id="file-upload"
                          type="file"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleFileUpload(e.target.files)
                              setIsDialogOpen(false)
                            }
                          }}
                          multiple
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="mt-4">
                    {files.map(file => (
                      <div key={file.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                        <span>{file.name}</span>
                        <Button variant="destructive" size="sm" onClick={() => deleteFile(file.id)}>
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      ))}
      <Dialog open={editingModule !== null} onOpenChange={(open) => !open && setEditingModule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="edit-module">Module Content</Label>
            <Textarea
              id="edit-module"
              value={editingModule?.content || ''}
              onChange={(e) => setEditingModule(prev => prev ? { ...prev, content: e.target.value } : null)}
            />
            <Button onClick={() => editingModule && editModule(editingModule.sessionIndex, editingModule.moduleId, editingModule.content)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}