import multer from "multer";
import path from "path";
import fs from "fs";
import moment from 'moment';
import { file } from "bun";

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const uploadPath = path.join(path.join(__dirname, "../../uploads")); // Construct the full upload path

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively if it doesn't exist
    }

    cb(null, uploadPath);
   },
    filename: (req, file, cb) => {

      const timestamp = moment().format('YYYYMMDDHHmmss');
      const fileExtension = path.extname(file.originalname);
      cb(null, `uploaded_file_${timestamp}${fileExtension}`);
    },

});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['text/plain', 'application/pdf', 'application/msword'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type.\nAllowed filetypes are .txt, .pdf, and msdocs'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

export default upload;