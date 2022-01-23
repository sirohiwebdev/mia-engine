import { Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import User from 'models/user';
import { AuthenticatedRequest } from 'types/JwtPayload';

export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { newPassword, oldPassword } = req.body;

  const userModel = new User(getDb());
  try {
    await userModel.changePassword(_id, newPassword, oldPassword);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
