import { Schema, model } from "mongoose";

const AssignmentSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	content: {
		type: String,
		trim: true,
	},
	link: {
		type: String,
		trim: true,
	},
	module: {
		type: Schema.Types.ObjectId,
		ref: "Module",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	}
});

export default model("Assignment", AssignmentSchema);