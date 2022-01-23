import { Router } from 'express';
import { body, query } from 'express-validator';

import { login, register, sendOtp, resetPassword, getAccessToken } from 'controllers/auth';
import { profile } from 'controllers/users/profile';
import { checkJwt } from 'middleware/checkJwt';
import requestValidator from 'middleware/validator';

const router = Router();

router.post('/login', [body(['email', 'password']).exists(), body(['email']).isEmail(), requestValidator], login);
router.post(
  '/register',
  [body(['email', 'password', 'name']).exists(), body('email').isEmail(), requestValidator],
  register,
);
router.get('/access-token', [query('refresh_token').exists(), requestValidator], getAccessToken);
router.post('/send-otp', [body(['email', 'type']).exists(), body('email').isEmail(), requestValidator], sendOtp);
router.post(
  '/reset-password',
  [body(['email', 'validationSession', 'password', 'token']).exists(), body('email').isEmail(), requestValidator],
  resetPassword,
);

export default router;
