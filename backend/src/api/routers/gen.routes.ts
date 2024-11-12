import { Router } from "express";
import genController from "../controllers/gen.controller";
import authMiddleware from "@/lib/middlewares/auth.middleware";

const router = Router();

router.post("/genQuiz", genController.genQuiz);

export default router;