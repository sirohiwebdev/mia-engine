import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../utils/response/custom-error/CustomError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(400).send(err.message);
};
