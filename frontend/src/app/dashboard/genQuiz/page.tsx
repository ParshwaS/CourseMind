'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import generateService from '@/components/service/generate.service'

export default function Component() {
    const [formData, setFormData] = useState({
        text: '',
        number: '',
        subject: '',
        level: ''
    })
    const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulating API call with setTimeout
        // setTimeout(() => {
        const mockQuiz = await generateService.generate(formData.text, formData.number, formData.subject, formData.level)
        setGeneratedQuiz(mockQuiz)
        setIsLoading(false)
        // }, 1500)
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Quiz Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="text">Text</Label>
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
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="Enter subject"
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
                <Card>
                    <CardHeader>
                        <CardTitle>Generated Quiz</CardTitle>
                    </CardHeader>
                    {/* {generatedQuiz.map((question: any, index: number) => {
                        return (
                            <p>{question}</p>
                        )
                    })} */}
                    <CardContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                            {JSON.stringify(generatedQuiz, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}