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
	course: {
		type: Schema.Types.ObjectId,
		ref: "Course",
		required: true,
	},
	courseMaterials: [{
		type: Schema.Types.ObjectId,
		ref: "CourseMaterial",
	}],
	assignments: [{
		type: Schema.Types.ObjectId,
		ref: "Assignment",
	}],
	quizzes: [{
		type: Schema.Types.ObjectId,
		ref: "Quiz",
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

export default model("Module", ModuleSchema);
