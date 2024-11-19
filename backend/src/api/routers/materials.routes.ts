import { Router } from "express";
import authMiddleware from "@/lib/middlewares/auth.middleware";
import upload from "@/lib/middlewares/multer.middleware";
import materialsController from "../controllers/materials.controller";

const router = Router();

router.get("/getById", materialsController.getById);
router.post("/upload", authMiddleware, upload.single("file"), materialsController.upload);
router.get("/getByCourseId", materialsController.getByCourseId);
router.get("/getByModuleId", materialsController.getByModuleId);
router.route("/:fileId").delete(authMiddleware, materialsController.delete)

export default router;