import { Request, Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import User from 'models/user';
import hashGenerator from 'services/hashGenerator';
import { createJwtToken } from 'utils/createJwtToken';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userModel = new User(getDb());

  try {
    const { role, _id, name, created_at } = await userModel.login(email, password);
    const access_token = createJwtToken({ email, _id: _id.toHexString(), name, created_at, role });
    const refresh_token = hashGenerator.generateForUser(email, 24);
    return res.status(200).json({ access_token, refresh_token });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
