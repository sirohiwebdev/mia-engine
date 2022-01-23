import { Router } from 'express';
import { body } from 'express-validator';

import { makeInvitation } from 'controllers/invitations';
import { checkJwt } from 'middleware/checkJwt';
import upload from 'middleware/uploader';
import requestValidator from 'middleware/validator';
import { create, list, get, saveInvitation } from 'views/invitations';

const router = Router();

router.get('/', [checkJwt], list);
router.post('/', [checkJwt, body(['template', 'text', 'contacts', 'contents']).exists(), requestValidator], create);

router.get('/:id', get);
router.post('/upload', upload.single('invitation'), saveInvitation);
router.post('/make', makeInvitation);

export default router;
