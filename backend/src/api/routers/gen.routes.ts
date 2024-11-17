import { Router } from "express";
import genController from "../controllers/gen.controller";

const router = Router();

router.post("/genQuiz", genController.genQuiz);

export default router;