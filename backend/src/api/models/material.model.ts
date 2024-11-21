import { Schema, model } from "mongoose";

const MaterialSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mimeType: {
    type: String,
    required: true, // Store the file's MIME type (jpeg, PDF etc)
  },
  filePath: {
	type: String,
	required: true
  },
  fileSize: {
    type: Number,
    required: true, // Store the file size in bytes
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: false,
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: "Module",
    required: false,
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
  },
});

export default model("Material", MaterialSchema);