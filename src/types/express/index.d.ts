import { JwtPayload } from '../JwtPayload';

declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload;
    }
    export interface Response {
      customSuccess(httpStatusCode: number, message: string, data?: any): Response;
    }
  }
}
