import { Router, Response } from 'express';
import { body } from 'express-validator';

import { makeInvitation } from 'controllers/invitations';
import { checkJwt } from 'middleware/checkJwt';
import upload from 'middleware/uploader';
import requestValidator from 'middleware/validator';
import whatsapp from 'services/whatsapp';
import { AuthenticatedRequest } from 'types/JwtPayload';
import { create, list, get, saveInvitation } from 'views/invitations';

const router = Router();

router.get('/', [checkJwt], list);
router.post('/', [checkJwt, body(['template', 'text', 'contacts', 'contents']).exists(), requestValidator], create);

router.get('/:id', get);
router.post('/upload', upload.array('invitation'), saveInvitation);
router.post('/make', makeInvitation);
router.post(
  '/share',
  checkJwt,
  [body(['message', 'fileUrl', 'contacts']).exists(), requestValidator],
  async (req: AuthenticatedRequest, res: Response) => {
    const { contacts, message, fileUrl } = req.body;

    const send = contacts.map((c) => whatsapp.sendMessage(`whatsapp:${c}`, message, fileUrl));

    try {
      await Promise.all(send);

      return res.status(200).json({ sent: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sent: false, message: err.message });
    }
  },
);

export default router;
