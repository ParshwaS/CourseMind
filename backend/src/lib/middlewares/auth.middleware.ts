import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import User from "@/api/models/user.model";

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).json({ message: "Token not found" });
	}

	return verify(
		token.split(" ")[1],
		process.env.JWT_SECRET || "secret",
		async (err, decoded: any) => {
			if (err) {
				return res.status(401).json({ message: "Invalid token" });
			}
			const user = await User.findOne({ email: decoded.email });
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
			req.userToken = { accessToken: token, userId: user._id.toString() };
			next();
		}
	);
};

export default authMiddleware;
