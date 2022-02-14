import { Request } from 'express';

import { UserRole } from 'models';
export type JwtPayload = {
  _id: string;
  name: string;
  email: string;
  created_at: string;
  role: UserRole;
};

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
