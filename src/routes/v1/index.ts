import { Router } from 'express';

import { errorHandler } from '../../middleware';

import auth from './auth';
import invitations from './invitations';
import payment from './payment';
import plans from './plans';
import subscription from './subscription';
import templates from './templates';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/templates', templates);
router.use('/invitations', invitations);
router.use('/plans', plans);
router.use('/users', users);
router.use('/subscriptions', subscription);
router.use('/payments', payment);
router.use(errorHandler);

export default router;
