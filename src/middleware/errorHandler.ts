import { NextFunction, Request, Response } from 'express';

import { getErrorMessage, ValidationError } from '../lib/errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: getErrorMessage(err) });
  }

  return res.status(500).json({ message: getErrorMessage(err) });
};
