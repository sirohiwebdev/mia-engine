import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { JwtPayload } from 'types/JwtPayload';
export const checkJwt = (req: Request, res: Response, next: NextFunction): void | Response => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.json(400).send('Authorization header not provided');
  }

  const token = authHeader.split(' ')[1];
  let jwtPayload: { [key: string]: any };
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
    ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
    req.user = jwtPayload as JwtPayload;
  } catch (err) {
    console.error(err);
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ code: 902, message: err.message });
    }
    return res.status(500).send(err.message);
  }
  next();
};
