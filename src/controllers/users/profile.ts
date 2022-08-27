import { Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import { PlanModel, SubscriptionModel, UserModel } from 'models';
import { AuthenticatedRequest } from 'types/JwtPayload';

export const profile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user;

  console.log('Id', _id);

  const userModel = new UserModel(getDb());
  const subscriptionModel = new SubscriptionModel(getDb());
  const planModel = new PlanModel(getDb());

  try {
    const user = await userModel.get(_id);
    const subscription = await subscriptionModel.find({ user: _id, active: true });

    let userSubscription = null;
    if (subscription.length) {
      userSubscription = subscription[0];
      userSubscription.plan = await planModel.get(userSubscription.plan);
    }

    return res.status(200).json({ ...user, password: undefined, subscription: userSubscription });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
