import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: false,
	},
	modules: [{
		type: Schema.Types.ObjectId,
		ref: "Material",
	}],
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

export default model("Course", CourseSchema);
