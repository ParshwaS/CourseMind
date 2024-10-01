import { Request } from "express";
import { Server } from "socket.io";
import { UserToken } from "./customTypes";

export interface IRequest extends Request {
	io: Server;
	userToken?: UserToken;
}
