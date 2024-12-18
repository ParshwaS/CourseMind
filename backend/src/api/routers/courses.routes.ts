import { Router } from "express";
import coursesController from "../controllers/courses.controller";
import authMiddleware from "@/lib/middlewares/auth.middleware";

const router = Router();

router.get("/get", authMiddleware, coursesController.get);
router.get("/getById", authMiddleware, coursesController.getById);
router.post("/create", authMiddleware, coursesController.create);
router.route("/:id").delete(authMiddleware, coursesController.delete);
router.patch("/updateModuleId:courseId", authMiddleware, coursesController.updateModuleId);

export default router;