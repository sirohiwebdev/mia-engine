import { Router } from 'express';

import auth from './auth';
import invitations from './invitations';
import plans from './plans';
import templates from './templates';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/templates', templates);
router.use('/invitations', invitations);
router.use('/plans', plans);
router.use('/users', users);

export default router;
