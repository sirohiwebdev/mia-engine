import { Request, Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import { TokenModel } from 'models';
import User from 'models/user';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, validationSession, token } = req.body;

  const userModel = new User(getDb());
  const validationModel = new TokenModel(getDb());

  try {
    const [exists] = await userModel.find({ email }, 1);
    if (exists) {
      throw new Error(`User already exists ${email}`);
    }
    await validationModel.isValid(email, token, validationSession);
    const registered = await userModel.register({ email, name, password, role: 'USER' });
    return res.status(200).json({ message: 'Registered successfully', _id: registered });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: err.message });
  }
};
