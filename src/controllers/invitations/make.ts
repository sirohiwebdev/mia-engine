import { NextFunction, Request, Response } from 'express';

import { ITemplate } from 'models';
import { imageGenerator } from 'services/invitations';
export const makeInvitation = async (req: Request, res: Response, next: NextFunction) => {
  const templateData = req.body as ITemplate;

  const invitation = await imageGenerator(templateData);

  return res.json({ invitation });
};
