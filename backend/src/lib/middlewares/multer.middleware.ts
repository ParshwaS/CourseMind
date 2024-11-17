import multer from "multer";
import path from "path";
import fs from "fs";
import moment from 'moment';
import { file } from "bun";

const timestamp = moment().format('YYYYMMDDHHmmss');
const filename = `uploaded_file_${timestamp}`;

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const uploadPath = path.join(path.join(__dirname, "../../uploads")); // Construct the full upload path

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively if it doesn't exist
    }

    cb(null, uploadPath); // Set the upload directory
   },
    filename: (req, file, cb) => {
      cb(null, filename); // Save the file with a timestamp and original name
    },

});

// // Multer instance for file uploads
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});

export default upload;