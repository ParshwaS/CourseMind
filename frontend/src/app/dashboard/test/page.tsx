'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon, UploadIcon, FileIcon } from 'lucide-react'

import coursesService from "@/components/service/courses.service"
import modulesService from "@/components/service/modules.service"
import materialsService from '@/components/service/materials.service'
import assignmentsService from '@/components/service/assignments.service'
import quizsService from '@/components/service/quizs.service'

type Module = {
  _id: string;
  name: string;
  courseId: string;
  materialId: {_id: string;
              name: string;}[];
  quizId: { _id: number;
            name: string}[];
  assignmentId: { _id: number;
                  name: string}[];
}

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([])
  const [courseName, setCourseName] = useState("")
  const [isNewModuleDialogOpen, setIsNewModuleDialogOpen] = useState(false)
  const [newModuleName, setNewModuleName] = useState("")
  const [isNewAssignmentDialogOpen, setIsNewAssignmentDialogOpen] = useState(false)
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("")
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, moduleId: string}[]>([])

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
  }, [courseId]);

  // useEffect used to fetch all modules under the given course id
  useEffect(() => {
    const fetchModulesAndRelatedData = async () => {
      if (courseId) {
        try {
          const moduleData = await modulesService.getByCourseId(courseId as string);

          const modulesWithDetails = await Promise.all(
            moduleData.map(async (module: Module) => {
              const [materials, quizzes, assignments] = await Promise.all([
                materialsService.getByModuleId(module._id),
                quizsService.getByModuleId(module._id),
                assignmentsService.getByModuleId(module._id),
              ]);

              return {
                ...module,
                materialId: materials || [],
                quizId: quizzes || [],
                assignmentId: assignments || [],
              };
            })
          );
          setModules(modulesWithDetails);
        } catch (error) {
          console.error("Error fetching modules and related data:", error);
        }
      }
    };

    fetchModulesAndRelatedData();
  }, [courseId]);

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
            materialId: [],
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
  
  const handleFileUpload = async (moduleId: string, uploadedFiles: FileList, courseId: string) => {

    const file = uploadedFiles[0];
    if (!file) return;

    try {
      const filesToUpload = Array.from(uploadedFiles).map(file => file);

      const uploadedFileData = await Promise.all(

        filesToUpload.map(async (file) => {

          const response = await materialsService.uploadFile(file, courseId, moduleId);

          return { ...response.data, _id: response.material._id, name: file.name };
        })
      );
      
      console.log('File uploaded successfully:', uploadedFileData);

      setModules((prevModules) => {
        return prevModules.map((module) => {
          if (module._id === moduleId) {
            return {
              ...module,
              materialId: [...module.materialId, ...uploadedFileData],
            };
          }
          return module;
        });
      });
      
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const deleteFile = async (moduleIndex: number, fileId: string) => {
    try {
      // Call the delete service to remove the file from the backend
      await materialsService.delete(fileId);
  
      // Update the local state to remove the file from the UI
      setModules((prevModules) => {
        const newModules = [...prevModules];
        newModules[moduleIndex].materialId = newModules[moduleIndex].materialId.filter(material => material._id !== fileId);
        return newModules;
      });
  
      console.log(`File with ID ${fileId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  

  // const addQuiz = () => {
  //   if (newQuizTitle.trim() && activeModuleIndex !== null) {
  //     setModules(prevModules => {
  //       const newModules = [...prevModules];
  //       newModules[activeModuleIndex].quizId.push({
  //         id: Date.now(),
  //       });
  //       return newModules;
  //     });
  //     setNewQuizTitle("");
  //     setIsNewQuizDialogOpen(false);
  //   }
  // }

  const addAssignment = () => {
    if (newAssignmentTitle.trim() && activeModuleIndex !== null) {
      setModules(prevModules => {
        const newModules = [...prevModules];
        newModules[activeModuleIndex].assignmentId.push({
          _id: Date.now(),
          name: ""
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{courseName || "Loading..."}</h1>
        <Button onClick={() => setIsNewModuleDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" /> New Module
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <Card key={module._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{module.name}</CardTitle>
                <Button variant="destructive" size="sm" onClick={() => deleteModule(module._id)}>
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Module
                </Button>
              </CardHeader>
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
                        <span>Quiz Name</span>
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
            </Card>
          ))}
        </div>

        <div>
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
                  <select 
                    className="border rounded p-2"
                    onChange={(e) => setActiveModuleIndex(Number(e.target.value))}
                  >
                    <option value="">Select Module</option>
                    {modules.map((module, index) => (
                      <option key={module._id} value={index}>{module.name}</option>
                    ))}
                  </select>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && activeModuleIndex !== null) {
                        handleFileUpload(modules[activeModuleIndex]._id, e.target.files, courseId as string)
                      }
                    }}
                    multiple
                    aria-label="Upload files"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                    <span className="flex items-center">
                      <FileIcon className="h-4 w-4 mr-2" />
                      {file.name}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Open</Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => {
                          const moduleIndex = modules.findIndex(m => m._id === file.moduleId);
                          if (moduleIndex !== -1) {
                            deleteFile(moduleIndex, file.name);
                          }
                        }}
                      >
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