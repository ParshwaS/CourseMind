import { Router } from "express";
import authRouter from "./auth.routes";
import genRouter from "./gen.routes";
import coursesRouter from "./courses.routes";
import moduleRouter from "./modules.routes";
import materialRouter from "./materials.routes"

const router = Router();

router.use("/auth", authRouter);
router.use("/genQuiz", genRouter);
router.use("/courses", coursesRouter);
router.use("/modules", moduleRouter);
router.use("/materials", materialRouter);

export default router;
