import { Request, Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import { TokenModel } from 'models';
import User from 'models/user';

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, validationSession, token, password } = req.body;

  const userModel = new User(getDb());

  try {
    const [user] = await userModel.find({ email }, 1);
    if (!user) throw new Error(`User with email ${email} not found`);

    const validationModel = new TokenModel(getDb());
    await validationModel.isValid(email, token, validationSession);
    await userModel.resetPassword(user._id.toHexString(), password);
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: err.message });
  }
};
