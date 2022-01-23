import { IInvitationTemplateData } from '@sirohiwebdev/mia-core';
import { NextFunction, Request, Response } from 'express';

import { imageGenerator } from 'services/invitations';
export const makeInvitation = async (req: Request, res: Response, next: NextFunction) => {
  const templateData = req.body as IInvitationTemplateData & { image: string };

  const invitation = await imageGenerator(templateData);

  return res.json({ invitation });
};
