"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"

type Question = {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

type Quiz = {
  id: number
  title: string
  questions: Question[]
}

export default function QuizCreator() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newOptions, setNewOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<number>(0)

  const createNewQuiz = () => {
    const newQuiz: Quiz = {
      id: Date.now(),
      title: "New Quiz",
      questions: []
    }
    setQuizzes([...quizzes, newQuiz])
    setCurrentQuiz(newQuiz)
  }

  const updateQuizTitle = (title: string) => {
    if (currentQuiz) {
      const updatedQuiz = { ...currentQuiz, title }
      setCurrentQuiz(updatedQuiz)
      setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q))
    }
  }

  const addQuestion = () => {
    if (currentQuiz && newQuestionText.trim() !== "") {
      const newQuestion: Question = {
        id: Date.now(),
        text: newQuestionText,
        options: newOptions.filter(option => option.trim() !== ""),
        correctAnswer
      }
      const updatedQuiz = {
        ...currentQuiz,
        questions: [...currentQuiz.questions, newQuestion]
      }
      setCurrentQuiz(updatedQuiz)
      setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q))
      setNewQuestionText("")
      setNewOptions(["", "", "", ""])
      setCorrectAnswer(0)
    }
  }

  const removeQuestion = (questionId: number) => {
    if (currentQuiz) {
      const updatedQuiz = {
        ...currentQuiz,
        questions: currentQuiz.questions.filter(q => q.id !== questionId)
      }
      setCurrentQuiz(updatedQuiz)
      setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Quiz Creator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="quiz-select">Select Quiz</Label>
                <Select
                  onValueChange={(value) => setCurrentQuiz(quizzes.find(q => q.id.toString() === value) || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes.map(quiz => (
                      <SelectItem key={quiz.id} value={quiz.id.toString()}>{quiz.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createNewQuiz}>Create New Quiz</Button>
              {currentQuiz && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input
                      id="quiz-title"
                      value={currentQuiz.title}
                      onChange={(e) => updateQuizTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-question">New Question</Label>
                    <Textarea
                      id="new-question"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Enter your question here"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {newOptions.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const updatedOptions = [...newOptions]
                          updatedOptions[index] = e.target.value
                          setNewOptions(updatedOptions)
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Select onValueChange={(value) => setCorrectAnswer(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {newOptions.map((_, index) => (
                          <SelectItem key={index} value={index.toString()}>Option {index + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addQuestion}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuiz ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{currentQuiz.title}</h2>
                {currentQuiz.questions.map((question, index) => (
                  <div key={question.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Question {index + 1}: {question.text}</h3>
                      <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <ul className="list-disc list-inside mt-2">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} className={optionIndex === question.correctAnswer ? "font-bold" : ""}>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>No quiz selected. Create a new quiz or select an existing one to preview.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}