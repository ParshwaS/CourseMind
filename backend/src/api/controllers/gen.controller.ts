import { Request, Response } from "express";
import axios from 'axios';

class GenController {
    public async genQuiz(req: Request, res: Response) {
        const ollamaApiUrl = 'http://localhost:5000/generate-quiz';
        const ollamaApiKey = 'your-ollama-api-key'; // Replace with your actual API key

        const generateQuizQuestions = async (context: string) => {
            const response = await axios.post(
                ollamaApiUrl,
                { context },
                {
                    headers: {
                        'Authorization': `Bearer ${ollamaApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        };

        const context = req.body.context; // Assuming the context is sent in the request body

        try {
            const quizQuestions = await generateQuizQuestions(context);
            res.json(quizQuestions);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate quiz questions' });
        }
    }
}
export default new GenController();
