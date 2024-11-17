import { Request, Response, NextFunction } from "express";
import quizModel from "../models/quiz.model";

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
}

export default new QuizController();