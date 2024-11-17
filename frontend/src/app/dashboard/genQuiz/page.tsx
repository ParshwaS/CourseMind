'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
    const [items, setItems] = useState<{ id: number; name: string; use: boolean }[]>([])
    const [selectedOption, setSelectedOption] = useState('')

    useEffect(() => {
        // Simulating fetching items based on a parameter
        const fetchItems = async () => {
            // Replace this with your actual API call or logic
            const response = await fetch('/api/items?param=someValue')
            const data = await response.json()
            setItems(data.map((item: any) => ({ ...item, use: false })))
        }

        fetchItems()
    }, []) // Add dependencies if needed

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const mockQuiz = await generateService.generate(formData.text, formData.number, formData.subject, formData.level)
        setGeneratedQuiz(mockQuiz)
        setIsLoading(false)
    }

    const handleCheckboxChange = (id: number) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, use: !item.use } : item
        ))
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

            {items.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Use</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={item.use}
                                                onCheckedChange={() => handleCheckboxChange(item.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {generatedQuiz && (
                <Card>
                    <CardHeader>
                        <CardTitle>Generated Quiz</CardTitle>
                    </CardHeader>
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