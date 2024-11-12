import { Schema, model } from "mongoose";

const MaterialSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	contentLink: {
		type: String,
		required: true,
		trim: true,
	},
	content: {
		type: String,
		required: false,
	},
	course: {
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

export default model("material", MaterialSchema);
