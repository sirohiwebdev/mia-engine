import { Request } from 'express';
export type JwtPayload = {
  _id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
