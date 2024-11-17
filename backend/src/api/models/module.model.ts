import { Schema, model } from "mongoose";

const ModuleSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	courseId: {
		type: Schema.Types.ObjectId,
		ref: "Course",
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

export default model("Module", ModuleSchema);
