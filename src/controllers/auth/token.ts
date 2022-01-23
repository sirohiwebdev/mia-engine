import { Request, Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import User from 'models/user';
import hashGenerator from 'services/hashGenerator';
import { createJwtToken } from 'utils/createJwtToken';

export const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  let { refresh_token } = req.query;

  const userModel = new User(getDb());

  try {
    const email = hashGenerator.validateHashForUser(refresh_token as string);

    console.log(email);
    if (!email) {
      return res.status(401).json({ code: 900, message: 'Refresh token expired. Login again' });
    }
    const [userData] = await userModel.find({ email }, 1);
    if (!userData) {
      return res.json(400).json({ code: 901, message: 'Invalid email' });
    }
    const { role, _id, name, created_at } = userData;
    const access_token = createJwtToken({ email, _id: _id.toHexString(), name, created_at, role });
    refresh_token = hashGenerator.generateForUser(email, 24);
    return res.status(200).json({ access_token, refresh_token });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: err.message });
  }
};
