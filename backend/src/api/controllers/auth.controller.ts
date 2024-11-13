import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

class AuthController {
	public async login(req: Request, res: Response, next: NextFunction) {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return compare(password, user.password, (err, result) => {
			if (err) {
				next(err);
			}
			if (!result) {
				return res.status(401).json({ message: "Invalid password" });
			}
			const token = sign(
				{ email: user.email, role: user.role },
				process.env.JWT_SECRET || "secret",
				{ expiresIn: "1d" }
			);
			return res.status(200).json({ user, accessToken: token });
		});
	}

	public async register(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, email, password } = req.body;
	
			// Log incoming data for debugging purposes
			console.log("Received registration data:", { name, email });
	
			// Hash the password
			const hashedPassword = await hash(password, 10);
	
			// Attempt to create a new user in the database
			await User.create({
				name,
				email,
				password: hashedPassword,
			});
	
			// Send success response with 201 status code
			return res.status(200).json({ message: "User created" });
		} catch (err) {
			// Log the specific error for debugging
			console.error("Error during registration:", err);
	
			// Pass error to the error handler middleware
			next(err);
		}
	}

	public async me(req: Request, res: Response, next: NextFunction) {
		const user = await User.findById(req.userToken?.userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json({ user });
	}
}

export default new AuthController();
