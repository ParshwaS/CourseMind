import * as mongoose from "mongoose";

const uri =	process.env.MONGODB_URI || "mongodb://localhost:27017/express-mongo";

if (process.env.NODE_ENV !== "test") {
	console.log(uri);
	mongoose.connect(uri).then(() => {
		console.log("> Connected to MongoDB");
	}).catch((error) => {
		console.log(">!! Error connecting to MongoDB", error);
	});
}
