import { Request, Response, NextFunction } from "express";
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import quizModel from "../models/quiz.model";

type QuizQuestion = {
    mcq: string;
    options: Record<string, string>;
    correct: string;
  };
  
type GeneratedQuiz = Record<string, QuizQuestion>;

class QuizController {

    public async getByModuleId(req: Request, res: Response, next: NextFunction) {
        const { moduleId } = req.query; // Extract moduleId from the request parameters
        if (!moduleId) {
            return res.status(400).json({ error: "Module ID is required" }); // Validate moduleId
        }
    
        return quizModel
            .find({ moduleId: moduleId }) // Query the database for quizzes matching the moduleId
            .then((quizzes) => {
                if (!quizzes || quizzes.length === 0) {
                    console.log("No quizzes found for the given module ID")
                    return res.status(200).json([]);
                }
                res.status(200).json(quizzes); // Respond with the retrieved quizzes
            })
            .catch((error) => {
                return next(error); // Pass the error to the next middleware
            });
    }

    public async saveQuiz(req: Request<{}, {}, { generatedQuiz: GeneratedQuiz; topic: string; level: string }>, res: Response, next: NextFunction) {
        
        const { moduleId } = req.query;
        const { generatedQuiz, topic, level } = req.body;
    
        if (!generatedQuiz) {
          return res.status(400).json({ error: "Quiz Not Found" });
        }
    
        try {
          // Create quiz PDF
          const mongoDBFileName = `${topic.replace(/\s+/g, '_')}_${level}.pdf`;
          const currentTime = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14);
          const fileName = `${currentTime}_${topic.replace(/\s+/g, '_')}_${level}.pdf`;
          const saveDirectory = path.resolve(__dirname, '../..', 'generates/quizzes');
          const filePath = path.join(saveDirectory, fileName);
    
          fs.mkdirSync(saveDirectory, { recursive: true });
    
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
          const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
          const fontSize = 12;
    
          // Add Header
          let yPosition = 800;
          page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: yPosition, size: fontSize, font: timesRomanFont });
          yPosition -= 20;
          page.drawText(`Topic: ${topic}`, { x: 50, y: yPosition, size: fontSize, font: timesRomanFont });
          yPosition -= 20;
          page.drawText(`Difficulty Level: ${level}`, { x: 50, y: yPosition, size: fontSize, font: timesRomanFont });
          yPosition -= 40;
    
          // Add Quiz Content
          page.drawText(`Quiz Questions:`, { x: 50, y: yPosition, size: fontSize, font: timesRomanFont });
          yPosition -= 20;
    
          for (const [key, value] of Object.entries(generatedQuiz)) {
            page.drawText(`${key}) ${value.mcq}`, { x: 50, y: yPosition, size: fontSize, font: timesRomanFont });
            yPosition -= 20;
    
            for (const [optionKey, optionValue] of Object.entries(value.options)) {
              page.drawText(`   ${optionKey}) ${optionValue}`, { x: 70, y: yPosition, size: fontSize, font: timesRomanFont });
              yPosition -= 20;
            }
    
            page.drawText(`Ans: ${value.correct}`, { x: 50, y: yPosition, size: fontSize, font: timesRomanFont });
            yPosition -= 30;
    
            // Add new page if needed
            if (yPosition < 50) {
              yPosition = 800;
              pdfDoc.addPage();
            }
          }
    
          // Save PDF
          const pdfBytes = await pdfDoc.save();
          fs.writeFileSync(filePath, pdfBytes);
          console.log(`PDF saved to: ${filePath}`);
    
          // Create quiz document in MongoDB
          const newQuiz = new quizModel({
            name: mongoDBFileName,
            filepath: filePath,
            moduleId: moduleId,
            userId: req.userToken?.userId
          });
    
          const savedQuiz = await newQuiz.save();

          return res.status(201).json(savedQuiz);

        } catch (error) {
          return next(error);
        }
    }
}

export default new QuizController();