import multer from 'multer';
import { uploadValidator } from '../utils/validation/uploadValidator';

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage }).single('file'); 

export function uploadWithValidation(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'File upload failed.',
        error: err.message,
      });
    }

    const file = req.file;
    const result = uploadValidator(file); 

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    next();
  });
}
