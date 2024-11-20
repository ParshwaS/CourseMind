'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'; 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import generateService from '@/components/service/generate.service'
import materialsService from '@/components/service/materials.service';
import quizsService from '@/components/service/quizs.service';

type Material = {_id: string;
    name: string;
    mimeType: string;
    filePath: string;
    courseId: string;
    moduleId: string;
    use: boolean
  }
export default function genQuiz() {

    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const moduleId = searchParams.get('moduleId');
    const quizRef = useRef<HTMLDivElement | null>(null);

    const [formData, setFormData] = useState({
        files: [],
        text: '',
        number: '',
        subject: '',
        level: ''
    })
    const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [materials, setMaterials] = useState<Material[]>([])
    const [selectedOption, setSelectedOption] = useState('')

    useEffect(() => {
        // fetching material based on a course and module
        const fetchItems = async () => {
            const response = await materialsService.getByCourseId(courseId as string);
            const data = await response
            setMaterials(data);
        }

        fetchItems()
    }, [])

    useEffect(() => {

        if (generatedQuiz && quizRef.current) {
            quizRef.current.scrollIntoView({ behavior: 'smooth' });
        }

    }, [generatedQuiz])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {

        const fileIds = materials.filter(item => item.use).map(item => item._id);

        try {

            e.preventDefault()
            setIsLoading(true)
            
            // const quiz = await generateService.generate(fileIds as Array<string>,
            //     formData.text,
            //     formData.number as any,
            //     formData.subject,
            //     formData.level
            // )
            // setGeneratedQuiz(quiz)
            setGeneratedQuiz({
                "1": {
                  "mcq": "What does the CourseMind system help professors do?",
                  "options": {
                    "a": "Organize study materials for students",
                    "b": "Plan courses, quizzes, and assignments easily",
                    "c": "Mark attendance for students",
                    "d": "Create forums for discussions"
                  },
                  "correct": "b"
                },
                "2": {
                  "mcq": "Which type of database does CourseMind use to store information?",
                  "options": {
                    "a": "A database that uses tables like MySQL",
                    "b": "A relational database like PostgreSQL",
                    "c": "A flexible database like MongoDB",
                    "d": "A lightweight database like SQLite"
                  },
                  "correct": "c"
                },
                "3": {
                  "mcq": "How does CourseMind handle user actions like creating a course?",
                  "options": {
                    "a": "By processing everything in real-time",
                    "b": "By completing tasks in batches",
                    "c": "By waiting for user actions to start tasks",
                    "d": "By running all tasks in a single sequence"
                  },
                  "correct": "c"
                }
              }
              )
            setIsLoading(false)
        } catch (error) {

            console.error("error generating Quiz: ", error);
            setIsLoading(false)
        }
    }

    const handleCheckboxChange = (id: string) => {
        setMaterials(materials.map(item => 
            item._id === id ? { ...item, use: !item.use } : item
        ))
    }

    const saveQuiz = (generatedQuiz: JSON, topic: string, level: string, moduleId: string) => {

        const response = quizsService.saveQuiz(generatedQuiz, topic, level, moduleId)

        console.log(response);

    }

    return (
        <div className="container mx-auto p-4">
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Quiz Generator</CardTitle>
                    <Select value={selectedOption} onValueChange={setSelectedOption}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chose Model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="option1">Model 1</SelectItem>
                            <SelectItem value="option2">Model 2</SelectItem>
                            <SelectItem value="option3">Model 3</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {materials.length > 0 && (
                        <div>
                            <Label htmlFor="text">Notes</Label>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Use</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {materials.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={item.use}
                                                    onCheckedChange={() => handleCheckboxChange(item._id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        )}

                        <div>
                            <Label htmlFor="text">Notes/Inputs</Label>
                            <Textarea
                                id="text"
                                name="text"
                                placeholder="Enter text to generate questions from"
                                value={formData.text}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="number">Number of Questions</Label>
                            <Input
                                type="number"
                                id="number"
                                name="number"
                                placeholder="Enter number of questions"
                                value={formData.number}
                                onChange={handleInputChange}
                                required
                                min="1"
                                max="20"
                            />
                        </div>
                        <div>
                            <Label htmlFor="subject">Topic</Label>
                            <Input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="Enter topic"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="level">Difficulty Level</Label>
                            <Input
                                type="text"
                                id="level"
                                name="level"
                                placeholder="Enter difficulty level"
                                value={formData.level}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Generate Quiz'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {generatedQuiz && (
            <Card ref={quizRef}>
                <CardHeader>
                    <CardTitle>Generated Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-y-auto max-h-96 p-4 border rounded-md bg-gray-50">
                        {Object.entries(generatedQuiz).map(([key, value]: any) => (
                            <div key={key} className="mb-4">
                                <p className="font-semibold">{`Q${key}) ${value.mcq}`}</p>
                                <div className="pl-4 space-y-1">
                                    {Object.entries(value.options).map(([optionKey, optionValue]: any) => (
                                        <p key={optionKey}>
                                            <span className="font-medium">{optionKey})</span> {optionValue}
                                        </p>
                                    ))}
                                </div>
                                <p className="mt-2 text-sm font-semibold text-green-600">{`Ans: ${value.correct}`}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardContent className="flex justify-start">
                    <Button onClick={() => saveQuiz(generatedQuiz, formData.subject, formData.level, moduleId as string)}>Export</Button>
                </CardContent>
            </Card>
        )}
        </div>
    )
}