import multer from "multer";
import path from "path";
import fs from "fs";

// Define the base directory for uploads (e.g., the backend root folder)
const BASE_DIR = path.join(__dirname, "../../uploads");

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const courseId = req.body.courseId; // Extract courseId from the request body
    const moduleId = req.body.moduleId; // Extract moduleId from the request body

    

    const uploadPath = path.join(BASE_DIR, courseId, moduleId); // Construct the full upload path

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively if it doesn't exist
    }

    cb(null, uploadPath); // Set the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save the file with a timestamp and original name
  },
});

// Multer instance for file uploads
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});

export default upload;