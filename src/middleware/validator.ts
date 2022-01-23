import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';

const requestValidator = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  return next();
};

export default requestValidator;
