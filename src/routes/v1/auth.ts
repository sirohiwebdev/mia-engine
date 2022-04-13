import { Router } from 'express';
import { body, check, query } from 'express-validator';

import { login, register, sendOtp, resetPassword, getAccessToken } from 'controllers/auth';
import requestValidator from 'middleware/validator';

const router = Router();

const validateMobileOrEmail = (r) => {
  if (!r.email && !r.mobile) {
    return Promise.reject('Provide either mobile or email');
  }

  return true;
};
router.post('/login', [body(['password']).exists(), body().custom(validateMobileOrEmail), requestValidator], login);
router.post(
  '/register',
  [body(['password', 'name']).exists(), body().custom(validateMobileOrEmail), requestValidator],
  register,
);
router.get('/access-token', [query('refresh_token').exists(), requestValidator], getAccessToken);
router.post('/send-otp', [body(['type']).exists(), body().custom(validateMobileOrEmail), requestValidator], sendOtp);
router.post(
  '/reset-password',
  [body(['validationSession', 'password', 'token']).exists(), body().custom(validateMobileOrEmail), requestValidator],
  resetPassword,
);

export default router;
