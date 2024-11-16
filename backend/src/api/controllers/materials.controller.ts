import { Request, Response, NextFunction } from "express";
import materialModel from "../models/material.model";

class MaterialController {
  public async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { originalname, mimetype, size, path: filePath } = req.file;
      const { moduleId, courseId } = req.body;

    //   if (!moduleId || !courseId) {
    //     return res.status(400).json({ message: "Module ID and Course ID are required" });
    //   }

      console.log(courseId, moduleId);

      const newMaterial = await materialModel.create({
        name: originalname,
        filePath,
        mimeType: mimetype,
        fileSize: size,
        moduleId: moduleId,
        courseId: courseId,
        userId: req.userToken?.userId,
      });

      res.status(201).json({ message: "File uploaded successfully", material: newMaterial });
    } catch (error) {
      console.error("Error uploading file:", error);
      next(error);
    }
  }
}

export default new MaterialController();