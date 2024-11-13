import { Router } from "express";
import coursesController from "../controllers/courses.controller";
import authMiddleware from "@/lib/middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, coursesController.get);
router.get("/:id", authMiddleware, coursesController.getById);
router.post("/", authMiddleware, coursesController.create);
router.route("/:id").delete(authMiddleware, coursesController.delete)

export default router;