import { Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import User from 'models/user';
import { AuthenticatedRequest } from 'types/JwtPayload';

export const profile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user;

  const userModel = new User(getDb());

  try {
    const user = await userModel.get(_id);
    return res.status(200).json({ ...user, password: undefined });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
