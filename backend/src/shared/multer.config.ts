import { Options } from 'multer';
import * as multer from 'multer';

export const multerConfig: Options = {
  storage: multer.diskStorage({
    destination: './uploads', // Diretório de destino para uploads
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
};
