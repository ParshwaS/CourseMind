import { Router } from "express";
import authMiddleware from "@/lib/middlewares/auth.middleware";
import assignmentsController from "../controllers/assignments.controller";

const router = Router();

router.get("/getByModuleId", authMiddleware, assignmentsController.getByModuleId);

export default router;