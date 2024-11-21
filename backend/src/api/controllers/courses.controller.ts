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
		try {
			const course = await courseModel.findById(req.query.id);

			if (!course) {
				return res.status(404).json({ message: "Course not found" });
			}

			return res.status(200).json({ course });
		} catch (error) {
			console.log(error);
			return next(error);
		}
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
				res.status(200).json(course);
			})
			.catch((error) => {
				return next(error);
			});
	}

	public async updateModuleId(req: Request, res: Response, next: NextFunction) {
        try {
            const { courseId } = req.params;;
        	const { moduleId } = req.body;

			console.log(`Course ID: ${courseId}`);

			if (!moduleId) {
				return res.status(400).json({ message: "Module ID is required" });
			}

			const updatedCourse = await courseModel.findOneAndUpdate(
				{ _id: courseId },
				{ $push: { moduleIds: moduleId } },
				{ new: true }
			);

			if (!updatedCourse) {
				return res.status(404).json({ message: "Course not found" });
			}
			res.status(200).json(updatedCourse);
        } catch(error) {
            return next(error);
        }
    }

	public async delete(req: Request, res: Response, next: NextFunction) {
		
        const courseId = req.params.id;
		console.log(courseId);
        return courseModel
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

export default new CourseController();
