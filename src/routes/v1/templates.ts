import { Router } from 'express';
import { body } from 'express-validator';

import upload from 'middleware/uploader';
import requestValidator from 'middleware/validator';
import { create, list, get, saveTemplate } from 'views/templates';

const router = Router();

router.get('/', [], list);
router.post(
  '/',
  [
    body(['thumbnail', 'type', 'name', 'id', 'layout', 'width', 'height', 'contents']).exists(),
    body(['contents']).isArray(),
    requestValidator,
  ],
  create,
);

router.get('/:id', get);
router.post(
  '/upload',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  saveTemplate,
);

// router.patch('/:id', [checkJwt], edit);

// router.delete('/:id', [checkJwt], destroy);

export default router;
