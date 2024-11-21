'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon, UploadIcon, FileIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import coursesService from "@/components/service/courses.service"
import modulesService from "@/components/service/modules.service"
import materialsService from '@/components/service/materials.service'
import assignmentsService from '@/components/service/assignments.service'
import quizsService from '@/components/service/quizs.service'

type Module = {
  _id: string;
  name: string;
  courseId: string;
  quizId: { _id: number;
            name: string}[];
  assignmentId: { _id: number;
                  name: string}[];
}

type Material = {
  _id: string;
  name: string
}

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([])
  const [courseName, setCourseName] = useState("")
  const [isNewModuleDialogOpen, setIsNewModuleDialogOpen] = useState(false)
  const [newModuleName, setNewModuleName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<Material[]>([])
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({})
  const [allExpanded, setAllExpanded] = useState(false);

  // useEffect used to fetch course name using course id
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const response = await coursesService.getById(courseId);
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
  }, []);

  // useEffect used to fetch all modules under the given course id
  useEffect(() => {
    const fetchModulesAndRelatedData = async () => {
      if (courseId) {
        try {
          const moduleData = await modulesService.getByCourseId(courseId as string);

          const modulesWithDetails = await Promise.all(
            moduleData.map(async (module: Module) => {
              const [quizzes, assignments] = await Promise.all([
                quizsService.getByModuleId(module._id),
                assignmentsService.getByModuleId(module._id)
              ]);
              return {
                ...module,
                quizId: quizzes || [],
                assignmentId: assignments || [],
              };
            })
          );

          setModules(modulesWithDetails);

          const uploadedFiles = await materialsService.getByCourseId(courseId as string);

          if (uploadedFiles) {
            setUploadedFiles(uploadedFiles);
          }

        } catch (error) {
          console.error("Error fetching modules and related data:", error);
        }
      }
    };

    fetchModulesAndRelatedData();
  }, []);

  // create new module
  const addModule = async (courseId: string) => {
    if (newModuleName.trim() !==""){
      try {
      const newModule = await modulesService.create(newModuleName.trim(), courseId);

      if (newModule) {
        setModules(prevModules => [
          ...prevModules, {
            _id: newModule._id,
            name: newModule.name,
            courseId: courseId,
            quizId: [],
            assignmentId: []
          }
        ]);
        console.log("Module added:", newModule.name);
        setNewModuleName("");
        setIsNewModuleDialogOpen(false);
      }
      } catch(error) {
        console.error(error);
      }
    }
  }

  const deleteModule = async (moduleId: string) => {
    try {
      if (!moduleId) {
        console.error('Module ID not found');
        return;
      }
      await modulesService.delete(moduleId);
      setModules(prevModules => prevModules.filter(module => module._id !== moduleId));
      console.log("Module deleted: ", moduleId);
      setNewModuleName("");
      setIsNewModuleDialogOpen(false);
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };
  
  const handleFileUpload = async (filesToUpload: FileList, courseId: string) => {

    const file = filesToUpload[0];
    if (!file) return;

    

    try {
      const files = Array.from(filesToUpload).map(file => file);

      const uploadedFileData = await Promise.all(
        files.map(async (file) => {
          const response = await materialsService.uploadFile(file, courseId);
          return { ...response.data, _id: response.material._id, name: file.name };
        }));
      
      console.log('File uploaded successfully:', uploadedFileData);

      setUploadedFiles((prevUploadedFiles) => [
        ...prevUploadedFiles,
        ...uploadedFileData.map((file) => ({
          _id: file._id,
          name: file.name
        })),
      ]);
      
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      // Call the delete service to remove the file from the backend
      await materialsService.delete(fileId);
  
      // Update the local state to remove the file from the UI
      setUploadedFiles((prevUploadedFiles) =>
        prevUploadedFiles.filter((uploadedFile) => uploadedFile._id !== fileId)
      );
  
      console.log(`File with ID ${fileId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const deleteQuiz = (moduleIndex: number, quizId: number) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex].quizId = newModules[moduleIndex].quizId.filter(quiz => quiz._id !== quizId);
      return newModules;
    });
  }

  const deleteAssignment = (moduleIndex: number, assignmentId: number) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex].assignmentId = newModules[moduleIndex].assignmentId.filter(assignment => assignment._id !== assignmentId);
      return newModules;
    });
  }

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const toggleAllModules = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    const updatedExpandedModules = Object.fromEntries(
      modules.map(module => [module._id, newExpandedState])
    );
    setExpandedModules(updatedExpandedModules);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{courseName || "Loading..."}</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={toggleAllModules}>
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
          <Button onClick={() => setIsNewModuleDialogOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" /> New Module
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-3/5 space-y-6">
          {modules.map((module, moduleIndex) => (
            <Card key={module._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{module.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleModuleExpansion(module._id)}>
                    {expandedModules[module._id] ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => deleteModule(module._id)}>
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete Module
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              {expandedModules[module._id] && (
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
                    <Button 
                      onClick={() => {router.push(`/dashboard/genQuiz?courseId=${courseId}&moduleId=${module._id}`);}} 
                      size="sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Quiz
                    </Button>
                    <div className="mt-2">
                      {module.quizId.map(quiz => (
                        <div key={quiz._id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                          <span>{quiz.name}</span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Open</Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteQuiz(moduleIndex, quiz._id)}>
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
                      onClick={() => {router.push(`/dashboard/genAssignment?courseId=${courseId}&moduleId=${module._id}`)}} 
                      size="sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Assignment
                    </Button>
                    <div className="mt-2">
                      {module.assignmentId.map(assignment => (
                        <div key={assignment._id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                          <span>Assignment Name</span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Open</Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteAssignment(moduleIndex, assignment._id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="w-full md:w-2/5">
          <Card>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="text-sm text-gray-500">Upload files in the following formats only: PDF, TXT, or Word Documents</label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files, courseId as string)
                      }
                    }}
                    multiple
                    aria-label="Upload files"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
                {(uploadedFiles || []).map((file) => (
                  <div key={file._id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                    <span className="flex items-center">
                      <FileIcon className="h-4 w-4 mr-2" />
                      {file.name}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Open</Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => { deleteFile(file._id); }}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isNewModuleDialogOpen} onOpenChange={setIsNewModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="new-module">Module Title</Label>
            <Input
              id="new-module"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
            />
            <Button onClick={() => addModule(courseId as string)}>Create Module</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}