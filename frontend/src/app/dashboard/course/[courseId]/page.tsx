'use client'

import { useParams } from 'next/navigation'
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

type Module = {
  _id: string;
  name: string;
  courseId: string;
  materialId: {id: number;name: string;type: string;}[];
  quizId: { id: number; name: string }[];
  assignmentId: { id: number; name: string }[];
}

export default function CoursePage() {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([])
  const [courseName, setCourseName] = useState("")
  const [isNewModuleDialogOpen, setIsNewModuleDialogOpen] = useState(false)
  const [newModuleName, setNewModuleName] = useState("")
  const [isNewAssignmentDialogOpen, setIsNewAssignmentDialogOpen] = useState(false)
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("")
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (courseId) {
      modulesService.getByCourseId(courseId as string).then((data) => {
        console.log(data);
        setModules(data);
      });
    }
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
    console.log("Received moduleId:", moduleId);
    const file = uploadedFiles[0];
    if (!file) return;

    try {
      const uploadedFileData = await materialsService.uploadFile(file, courseId, moduleId);

      console.log('File uploaded successfully:', uploadedFileData);

      // setModules(prevModules => {
      //   const newModules = [...prevModules];
      //   const newFiles = Array.from(uploadedFiles).map(file => ({
      //     id: Date.now() + Math.random(),
      //     name: file.name,
      //     type: file.type
      //   }));
      //   newModules[moduleIndex].materialId = [...newModules[moduleIndex].materialId, ...newFiles];
      //   return newModules;
      // });

    }catch(error) {
      console.log(error);
    }
  }

  const deleteFile = (moduleIndex: number, fileId: number) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex].materialId = newModules[moduleIndex].materialId.filter(materialId => materialId.id !== fileId);
      return newModules;
    });
  }

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
          id: Date.now(),
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
      newModules[moduleIndex].quizId = newModules[moduleIndex].quizId.filter(quiz => quiz.id !== quizId);
      return newModules;
    });
  }

  const deleteAssignment = (moduleIndex: number, assignmentId: number) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex].assignmentId = newModules[moduleIndex].assignmentId.filter(assignment => assignment.id !== assignmentId);
      return newModules;
    });
  }
  
  return ( <div className="container mx-auto p-4"> <div className="flex justify-between items-center mb-6"> <h1 className="text-3xl font-bold">{courseName || "Loading..."}</h1> <Button onClick={() => setIsNewModuleDialogOpen(true)}> <PlusIcon className="h-4 w-4 mr-2" /> New Module </Button> </div>

  {modules.map((module, moduleIndex) => (
    <Card key={module._id} className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{module.name}</CardTitle>
        <Button variant="destructive" size="sm" onClick={() => deleteModule(module._id)}>
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
              onChange={(e) => e.target.files && handleFileUpload(module._id, e.target.files, courseId as string)}
              multiple
              aria-label="Upload files"
            />
          </div>
          <div className="mt-2">
            {module.materialId.map(file => (
              <div key={file.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                <span className="flex items-center">
                  <FileIcon className="h-4 w-4 mr-2" />
                  {file.name}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Open</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteFile(moduleIndex, file.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
          <Button 
            onClick={() => {}} 
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Quiz
          </Button>
          <div className="mt-2">
            {module.quizId.map(quiz => (
              <div key={quiz.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                <span>Quiz Name</span>
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
            onClick={() => {}} 
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Assignment
          </Button>
          <div className="mt-2">
            {module.assignmentId.map(assignment => (
              <div key={assignment.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                <span>Assignment Name</span>
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
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
        />
        <Button onClick={() => addModule(courseId as string)}>Create Module</Button>
      </div>
    </DialogContent>
  </Dialog>

  {/* <Dialog open={isNewQuizDialogOpen} onOpenChange={setIsNewQuizDialogOpen}>
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
  </Dialog> */}

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