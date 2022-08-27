import { NextFunction, Request, Response } from 'express';

import { getDb } from 'database/connect';
import User from 'models/user';
import hashGenerator from 'services/hashGenerator';
import { createJwtToken } from 'utils/createJwtToken';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, mobile, password, role = 'USER' } = req.body;

  const userModel = new User(getDb());

  try {
    const { _id, name, created_at } = await userModel.login({ email, mobile, password, role });
    const access_token = createJwtToken({ email, mobile, _id: _id.toHexString(), name, created_at, role });
    const refresh_token = hashGenerator.generateForUser(email || mobile, 24);
    return res.status(200).json({ access_token, refresh_token });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
