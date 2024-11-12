import { Router } from "express";
import authRouter from "./auth.routes";
import genRouter from "./gen.routes";
import coursesRouter from "./courses.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/genQuiz", genRouter);
router.use("/courses", coursesRouter);

export default router;
