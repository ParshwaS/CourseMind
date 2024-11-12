import { Request, NextFunction, Response } from "express";
import courseModel from "../models/course.model";
import materialModel from "../models/material.model";

class CourseController {
	public async get(req: Request, res: Response, next: NextFunction) {
		return courseModel
			.find({ userId: req.userToken?.userId })
			.then((courses) => {
				res.status(200).json(courses);
			})
			.catch((error) => {
				return next(error);
			});
	}

	public async getById(req: Request, res: Response, next: NextFunction) {
		return courseModel
			.findById(req.query.id)
			.then((courses: any) => {
                let materials: any[] = [];
				courses?.modules.forEach((module: any) => {
					materialModel.findById(module).then((material) => {
                        // console.log(material);
						materials.push(material);
					});
				});
				res.status(200).json({course: courses, materials});
			})
			.catch((error) => {
				console.log(error);
				return next(error);
			});
	}

	public async create(req: Request, res: Response, next: NextFunction) {
		const course = new courseModel({
			name: req.body.name,
			description: req.body.description || "",
			userId: req.userToken?.userId,
		});
		return course
			.save()
			.then((course) => {
				res.status(201).json(course);
			})
			.catch((error) => {
				return next(error);
			});
	}
}

export default new CourseController();
