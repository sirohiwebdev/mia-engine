import multer from 'multer';
import { v4 } from 'uuid';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'invitation') {
      cb(null, 'uploads/invitations');
      return;
    }
    cb(null, 'uploads/templates');
  },
  filename: function (req, { originalname, fieldname }, cb) {
    const extIndex = originalname.lastIndexOf('.');
    const name = originalname.substring(0, extIndex);
    const ext = originalname.substring(extIndex + 1);
    cb(null, `${fieldname}-${name}-${v4()}.${ext}`);
  },
});

const upload = multer({ storage });
export default upload;
