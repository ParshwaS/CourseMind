"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Upload, Wand2 } from "lucide-react"

type Quiz = {
  id: number
  title: string
  questions: string[]
  marks: number
}

type Assignment = {
  id: number
  title: string
  description: string
  marks: number
}

export default function ProfessorDashboard() {
  const [content, setContent] = useState("")
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [questionCount, setQuestionCount] = useState(5)
  const [totalMarks, setTotalMarks] = useState(10)
  const [generationType, setGenerationType] = useState<"quiz" | "assignment">("quiz")

  const handleContentUpload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  const generateQuiz = () => {
    // Simulating AI generation of quiz
    const newQuiz: Quiz = {
      id: Date.now(),
      title: `Quiz ${quizzes.length + 1}`,
      questions: Array(questionCount).fill("AI-generated question"),
      marks: totalMarks
    }
    setQuizzes([...quizzes, newQuiz])
  }

  const generateAssignment = () => {
    // Simulating AI generation of assignment
    const newAssignment: Assignment = {
      id: Date.now(),
      title: `Assignment ${assignments.length + 1}`,
      description: "AI-generated assignment description",
      marks: totalMarks
    }
    setAssignments([...assignments, newAssignment])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Professor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your course content here..."
              value={content}
              onChange={handleContentUpload}
              className="min-h-[200px]"
            />
            <Button className="mt-4" onClick={() => alert("Content uploaded!")}>
              <Upload className="mr-2 h-4 w-4" /> Upload Content
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Generation Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="generation-type">Generation Type</Label>
                <Select onValueChange={(value: "quiz" | "assignment") => setGenerationType(value)}>
                  <SelectTrigger id="generation-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="question-count">Number of Questions</Label>
                <Input
                  id="question-count"
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="total-marks">Total Marks</Label>
                <Input
                  id="total-marks"
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              <Button onClick={generationType === "quiz" ? generateQuiz : generateAssignment}>
                <Wand2 className="mr-2 h-4 w-4" /> Generate {generationType === "quiz" ? "Quiz" : "Assignment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quizzes">
              <TabsList>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>
              <TabsContent value="quizzes">
                {quizzes.length === 0 ? (
                  <p>No quizzes generated yet.</p>
                ) : (
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <Card key={quiz.id}>
                        <CardHeader>
                          <CardTitle>{quiz.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Number of questions: {quiz.questions.length}</p>
                          <p>Total marks: {quiz.marks}</p>
                          <Button className="mt-2" variant="outline">View Quiz</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="assignments">
                {assignments.length === 0 ? (
                  <p>No assignments generated yet.</p>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <Card key={assignment.id}>
                        <CardHeader>
                          <CardTitle>{assignment.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{assignment.description}</p>
                          <p>Total marks: {assignment.marks}</p>
                          <Button className="mt-2" variant="outline">View Assignment</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}