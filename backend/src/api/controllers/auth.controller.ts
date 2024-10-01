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
			return res.status(200).json({ token });
		});
	}

	public async register(req: Request, res: Response, next: NextFunction) {
		const { name, email, password } = req.body;
		return hash(password, 10, (err, hash) => {
			if (err) {
				next(err);
			}
			return User.create({
				name,
				email,
				password: hash,
			})
				.then(() => {
					return res.status(201).json({ message: "User created" });
				})
				.catch((err) => {
					next(err);
				});
		});
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
