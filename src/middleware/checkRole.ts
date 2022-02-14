import { Request, Response, NextFunction } from 'express';

import { AuthenticatedRequest } from 'types/JwtPayload';

import { UserRole } from './../models/user';

export const checkRole = (roles: UserRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { role } = req.user;

    if (roles.indexOf(role) === -1) {
      //   const errors = [
      //     'Unauthorized - Insufficient user rights',
      //     `Current role: ${role}. Required role: ${roles.toString()}`,
      //   ];

      return res.status(400).json({ message: "User don't have permission to perform this action." });
    }
    return next();
  };
};
