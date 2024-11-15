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
    
            if (!courseId || !name) {
                return res.status(400).json({ message: "Course ID and name are required" });
            }
    
            const module = new moduleModel({
                name,
                courseId: courseId,
                userId: req.userToken?.userId
            });
    
            const savedModule = await module.save();
            return res.status(201).json(savedModule);
        } catch (error) {
            return next(error);
        }
    }    

	public async delete(req: Request, res: Response, next: NextFunction) {
		
        const moduleId = req.params.id;
        return moduleModel
            .findByIdAndDelete(moduleId)
            .then((deletedCourse) => {
                if (!deletedCourse) {
                    return res.status(404).json({ message: "Module not found" });
                }
                res.status(200).json({ message: "Module deleted successfully" });
            })
            .catch((error) => {
                return next(error);
            });
    }
}

export default new ModuleController();