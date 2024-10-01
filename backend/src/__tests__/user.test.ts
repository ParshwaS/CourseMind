import { connect, clearDatabase, closeDatabase } from "./db";
import { app } from "../app";
import { agent } from "supertest";

beforeAll(async () => await connect());
afterAll(async () => await closeDatabase());

const request = agent(app);

describe("Checking Default Route", () => {
	test("It should return 200", async () => {
		const response = await request.get("/");
		expect(response.status).toBe(200);
	});

	test("It should return 'Hello World'", async () => {
		const response = await request.get("/");
		expect(response.text).toBe("Hello World");
	});
});
