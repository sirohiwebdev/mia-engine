import { Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import { SubscriptionModel, UserModel } from 'models';
import { AuthenticatedRequest } from 'types/JwtPayload';

export const profile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user;

  const userModel = new UserModel(getDb());
  const subscriptionModel = new SubscriptionModel(getDb());

  try {
    const user = await userModel.get(_id);
    const subscription = await subscriptionModel.find({ user: _id });
    return res.status(200).json({ ...user, password: undefined, subscription: subscription[0] });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
