import { Router } from "express";
import quizzesController from "../controllers/quizzes.controller"

const router = Router();

router.get("/getByModuleId", quizzesController.getByModuleId);

export default router;