import { Schema, model } from "mongoose";

const QuizSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	filepath: {
		type: String,
		required: true,
	},
	moduleId: {
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

export default model("Quiz", QuizSchema);