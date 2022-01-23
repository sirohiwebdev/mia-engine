import { Router } from 'express';
import { body } from 'express-validator';

import { changePassword } from 'controllers/users/changePassword';
import { profile } from 'controllers/users/profile';
import { checkJwt } from 'middleware/checkJwt';
import requestValidator from 'middleware/validator';
const router = Router();

router.get('/profile', [checkJwt], profile);
router.get(
  '/change-password',
  [checkJwt],
  [body(['newPassword', 'oldPassword']).exists(), requestValidator],
  changePassword,
);

export default router;
