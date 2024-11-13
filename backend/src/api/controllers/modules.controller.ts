import { Request, NextFunction, Response } from "express";
import moduleModel from "../models/module.model";

class ModuleController{
    public async get(req: Request, res: Response, next: NextFunction) {
		return moduleModel
			.find({ userId: req.userToken?.userId })
			.then((modules) => {
				res.status(200).json(modules);
			})
			.catch((error) => {
				return next(error);
			});
	}

	public async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const module = await moduleModel.findById(req.query.id);
	
			if (!module) {
				return res.status(404).json({ message: "Course not found" });
			}
	
			return res.status(200).json({ module });
		} catch (error) {
			console.log(error);
			return next(error);
		}
	}	

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, courseId } = req.body;

            console.log(name, courseId);
    
            // Validate required fields
            if (!courseId || !name) {
                return res.status(400).json({ message: "Course ID and name are required" });
            }
    
            // Create a new module with the necessary fields
            const module = new moduleModel({
                name,
                course: courseId,
                userId: req.userToken?.userId
            });
    
            // Save the module and respond with the created document
            const savedModule = await module.save();
            return res.status(201).json(savedModule);
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }    

	public async delete(req: Request, res: Response, next: NextFunction) {
		
        const courseId = req.params.id;
		console.log(courseId);
        return moduleModel
            .findByIdAndDelete(courseId)
            .then((deletedCourse) => {
                if (!deletedCourse) {
                    return res.status(404).json({ message: "Course not found" });
                }
                res.status(200).json({ message: "Course deleted successfully" });
            })
            .catch((error) => {
                return next(error);
            });
    }
}

export default new ModuleController();