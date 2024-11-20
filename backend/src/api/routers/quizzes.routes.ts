import { Router } from "express";
import quizzesController from "../controllers/quizzes.controller"

const router = Router();

router.get("/getByModuleId", quizzesController.getByModuleId);
router.post("/saveQuiz", quizzesController.saveQuiz);

export default router;