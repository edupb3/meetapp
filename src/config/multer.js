import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      const customFileName = crypto.randomBytes(18).toString('hex');
      const fileExtension = file.originalname.split('.')[1];
      cb(null, `${customFileName}.${fileExtension}`);
    },
  }),
};
