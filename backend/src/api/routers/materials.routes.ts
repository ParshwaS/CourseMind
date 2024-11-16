import { Router } from "express";
import authMiddleware from "@/lib/middlewares/auth.middleware";
import upload from "@/lib/middlewares/multer.middleware";
import materialsController from "../controllers/materials.controller";

const router = Router();

router.post("/upload", authMiddleware, upload.single("file"), materialsController.upload);

export default router;