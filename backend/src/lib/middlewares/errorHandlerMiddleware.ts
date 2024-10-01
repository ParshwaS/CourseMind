import { NextFunction, Response, Request } from "express";
import { ExpressError } from "../../lib/helpers/customError";

const errorHandlerMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ExpressError) {
		res.status(err.status).json(err.toJSON());
	} else {
		next();
	}
};

export default errorHandlerMiddleware;
