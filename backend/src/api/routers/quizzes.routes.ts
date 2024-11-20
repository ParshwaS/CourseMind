import { Router } from "express";
import quizzesController from "../controllers/quizzes.controller";
import authMiddleware from "@/lib/middlewares/auth.middleware";

const router = Router();

router.get("/getByModuleId", authMiddleware, quizzesController.getByModuleId);
router.post("/saveQuiz", authMiddleware, quizzesController.saveQuiz);

export default router;