import { Router } from "express";
import moduleController from "../controllers/modules.controller";
import authMiddleware from "@/lib/middlewares/auth.middleware";

const router = Router();

router.get("/get", authMiddleware, moduleController.get);
router.get("/getById", authMiddleware, moduleController.getById);
router.post("/create", authMiddleware, moduleController.create);
router.route("/:id").delete(authMiddleware, moduleController.delete)

export default router;