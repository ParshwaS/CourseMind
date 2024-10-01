import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: any = null;

export let connect = async () => {
	mongod = await MongoMemoryServer.create();
	let uri = await mongod.getUri();

	mongoose.connect(uri);
	mongoose.connection.on("error", (err) => {
		if (err) {
			console.log("Error in connecting to database!");
		}
	});
};

export let closeDatabase = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
};

export let clearDatabase = async () => {
	let collections = mongoose.connection.collections;
	for (let key in collections) {
		let collection = collections[key];
		await collection.deleteMany({});
	}
};
