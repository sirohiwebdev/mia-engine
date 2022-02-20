import { Router, NextFunction, Response } from 'express';
import { body } from 'express-validator';

import { createSubscription, get } from 'controllers/subscription';
import { AuthenticatedRequest } from 'types/JwtPayload';

import { checkJwt } from '../../middleware';

const router = Router();

router.get('/:id', checkJwt, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { query = {}, user } = req;

  const subscription = await get({ _id: query.id as string, user: user._id });

  return res.json(subscription);
});

router.post('/', checkJwt, [body(['subscriptionDate', 'plan']).exists()], async (req, res, next) => {
  const { body } = req;
  const plan = await createSubscription({ ...body, subscriptionDate: new Date().toISOString() });
  return res.json(plan);
});

export default router;
