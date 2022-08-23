import AWS from 'aws-sdk';
import { replace } from 'lodash';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 } from 'uuid';

const s3 = new AWS.S3();

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.S3_STORAGE_BUCKET,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, { originalname, fieldname }, cb) {
    let prefix = 'templates';
    if (fieldname === 'invitation') {
      prefix = 'invitations';
    }

    const extIndex = originalname.lastIndexOf('.');
    const name = originalname.substring(0, extIndex);
    const ext = originalname.substring(extIndex + 1);

    const finalKey = replace(`${fieldname}-${name}-${v4()}.${ext}`, / /g, '-');
    cb(null, `${prefix}/${finalKey}`);
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'invitation') {
      cb(null, 'uploads/invitations');
      return;
    }
    if (file.fieldname === 'templates') {
      cb(null, 'uploads/templates');
      return;
    }
    cb(null, 'uploads/data');
  },
  filename: function (req, { originalname, fieldname }, cb) {
    const extIndex = originalname.lastIndexOf('.');
    const name = originalname.substring(0, extIndex);
    const ext = originalname.substring(extIndex + 1);
    cb(null, `${fieldname}-${name}-${v4()}.${ext}`);
  },
});

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: s3Storage });
export const diskUploader = multer({ storage });
export const uploadToMemory = multer({ storage: memoryStorage });
export default upload;
