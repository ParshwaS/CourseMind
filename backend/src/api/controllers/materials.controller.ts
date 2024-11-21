import { Request, Response, NextFunction } from "express";
import materialModel from "../models/material.model";

class MaterialController {

  public async getById(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.query;
    if (!_id) {
        return res.status(400).json({ error: "Material ID is required", _id});
    }

    return materialModel
        .findById(_id)
        .then((material) => {
            if (!material) {
              console.log("No material found for the given ID")
              return res.status(200).json([]);
            }
            res.status(200).json(material);
        })
        .catch((error) => {
            return next(error);
        });
  }

  public async getByCourseId(req: Request, res: Response, next: NextFunction) {
    const { courseId } = req.query;
    if (!courseId) {
        return res.status(400).json({ error: "Course ID is required", courseId});
    }

    return materialModel
        .find({ courseId: courseId })
        .then((materials) => {
            if (!materials || materials.length === 0) {
              console.log("No material found for the given module ID")
              return res.status(200).json([]);
            }
            res.status(200).json(materials);
        })
        .catch((error) => {
            return next(error);
        });
  }

  public async getByModuleId(req: Request, res: Response, next: NextFunction) {
    const { moduleId } = req.query; // Extract moduleId from the request parameters
    if (!moduleId) {
        return res.status(400).json({ error: "Module ID is required", moduleId}); // Validate moduleId
    }

    return materialModel
        .find({ moduleId: moduleId }) // Query the database for materials matching the moduleId
        .then((materials) => {
            if (!materials || materials.length === 0) {
              console.log("No material found for the given module ID")
              return res.status(200).json([]);
            }
            res.status(200).json(materials); // Respond with the retrieved materials
        })
        .catch((error) => {
            return next(error); // Pass the error to the next middleware
        });
  }
  
  public async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { originalname, mimetype, size, path: filePath } = req.file;
      const { courseId } = req.body;

      const newMaterial = await materialModel.create({
        name: originalname,
        filePath: filePath,
        mimeType: mimetype,
        fileSize: size,
        courseId: courseId,
        userId: req.userToken?.userId,
      });

      res.status(201).json({ message: "File uploaded successfully", material: {
        _id: newMaterial._id,
        name: newMaterial.name,
        filePath: newMaterial.filePath,
        mimeType: newMaterial.mimeType,
        fileSize: newMaterial.fileSize,
        moduleId: newMaterial.moduleId,
        courseId: newMaterial.courseId,
        userId: newMaterial.userId,
      } });
    } catch (error) {
      console.error("Error uploading file:", error);
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
		
    const materialId = req.params.fileId;
    return materialModel
        .findByIdAndDelete(materialId)
        .then((deletedCourse) => {
            if (!deletedCourse) {
                return res.status(404).json({ message: "Material not found" });
            }
            res.status(200).json({ message: "Material deleted successfully" });
        })
        .catch((error) => {
            return next(error);
        });
}
}

export default new MaterialController();