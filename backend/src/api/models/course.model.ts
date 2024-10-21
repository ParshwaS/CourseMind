import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	modules: [{
		type: Schema.Types.ObjectId,
		ref: "Module",
	}],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default model("Course", CourseSchema);
