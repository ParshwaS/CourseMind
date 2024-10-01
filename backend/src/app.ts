import express from "express";
// import path from "path";
import mainRouter from "@/api/routers";
import "dotenv/config";
import cors from "cors";
import "./lib/config/database/config";
import * as http from "http";
import { errorHandlerMiddleware } from "@/lib/middlewares";
import { Server } from "socket.io";
import logger from "@/lib/helpers/logger";
import next from "next";
import path from "path";
import { UserToken } from "./lib/helpers/customTypes";

// Extending Request interface to add userToken
declare global {
	namespace Express {
		export interface Request {
			userToken?: UserToken;
			io?: Server;
		}
	}
}

// Setting up express basics
const app = express();

app.use(logger.HTTPLogger);

// Basics for express application
app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Finally hosting everything on HTTPS server
let server: any = new http.Server(app);

// Initializing Socket Server
const io = new Server(server);

// Adding io as request parameter so we can use easily in further routes
app.use((req: any, res, next) => {
	req.io = io;
	next();
});

// Setting up routes
app.use("/api", mainRouter);

// Setting up Next.js
if (process.env.NODE_ENV === "production") {
	const nextApp = next({
		dev: false,
		hostname: process.env.HOSTNAME || "localhost",
		port: parseInt(process.env.PORT || "3000"),
		dir: path.join(__dirname, process.env.FRONTEND_DIR || "../../frontend"),
	});

	const nextHandler = nextApp.getRequestHandler();

	// Setting up Next.js routes
	nextApp.prepare().then(() => {
		console.log("> Next.JS is running");
		app.get("*", (req, res) => {
			return nextHandler(req, res);
		});
	});
}

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../static", "public/index.html"));
// });

app.use(errorHandlerMiddleware);

export { app, server };
