import { Router, NextFunction, Response } from 'express';
import { body } from 'express-validator';

import { makePaymentForSubscription } from 'controllers/payment';
import { createSubscription, get } from 'controllers/subscription';
import requestValidator from 'middleware/validator';
import { AuthenticatedRequest } from 'types/JwtPayload';

import { checkJwt } from '../../middleware';

const router = Router();

router.get('/:id', checkJwt, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { query = {}, user } = req;

  const subscription = await get({ _id: query.id as string, user: user._id });

  return res.json(subscription);
});

router.post('/', checkJwt, [body(['subscriptionDate', 'plan']).exists(), requestValidator], async (req, res, next) => {
  const { body } = req;
  const plan = await createSubscription({ ...body, subscriptionDate: new Date().toISOString() });
  return res.json(plan);
});

router.post(
  '/buy',
  checkJwt,
  [body(['plan']).exists(), requestValidator],
  async (req: AuthenticatedRequest, res: Response, next) => {
    const { user, body } = req;
    const paymentData = await makePaymentForSubscription({ user: user._id, plan: body.plan });

    return res.json(paymentData);
  },
);

export default router;
