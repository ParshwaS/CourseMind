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
});

export default model("CourseMaterial", MaterialSchema);
