import { Request, Response, NextFunction } from "express";
import assignmentModel from "../models/assignment.model";

class AssignmentController {

    public async getByModuleId(req: Request, res: Response, next: NextFunction) {
        const { moduleId } = req.query; // Extract moduleId from the request parameters
        if (!moduleId) {
            return res.status(400).json({ error: "Module ID is required" }); // Validate moduleId
        }
    
        return assignmentModel
            .find({ moduleId: moduleId }) // Query the database for assignments matching the moduleId
            .then((assignments) => {
                if (!assignments || assignments.length === 0) {
                    console.log("No assignments found for the given module ID")
                    return res.status(200).json([]);
                }
                res.status(200).json(assignments); // Respond with the retrieved assignments
            })
            .catch((error) => {
                return next(error); // Pass the error to the next middleware
            });
      }
}

export default new AssignmentController();