import { Router } from 'express';

import upload from 'middleware/uploader';
import { create, list, get, saveTemplate } from 'views/templates';

import { checkRole, checkJwt } from './../../middleware';

const router = Router();

router.get('/', [], list);
router.post(
  '/',
  checkJwt,
  checkRole(['ADMIN']),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
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
