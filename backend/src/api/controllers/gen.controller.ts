import { NextFunction, Request, Response } from "express";
import materialModel from "../models/material.model";
import { ExpressError } from "@/lib/helpers/customError";

class GenController {
    public async genQuiz(req: Request, res: Response, next: NextFunction) {
        const fastAPIURL = "http://127.0.0.1:8000/api/generate";
        // console.log(req.body);
        // let TEXT = await materialModel.findById(req.body.material).then((material) => {
        //     return material?.content;
        // }).catch((error) => {
        //     return false;
        // });
        const TEXT = req.body.text;
        if (TEXT === false) {
            return next(new ExpressError("Material not found", 404));
        }
        const queryParam = {
            TEXT: TEXT as string,
            NUMBER: req.body.number,
            SUBJECT: req.body.subject,
            TONE: req.body.level,
        }
        console.log(`${fastAPIURL}?${new URLSearchParams(queryParam)}`);
        const response = fetch(`${fastAPIURL}?${new URLSearchParams(queryParam)}`);
        response.then((response) => {
            response.json().then((data) => {
                res.status(200).json(data);
            }).catch((error) => {
                return next(error);
            });
        }).catch((error) => {
            return next(error);
        });
    }
}
export default new GenController();
