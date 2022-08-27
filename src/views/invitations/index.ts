import { NextFunction, Response } from 'express';

import { createInvitation, listInvitations } from 'controllers/invitations';
import getInvitation from 'controllers/invitations/get';
import { AuthenticatedRequest } from 'types/JwtPayload';

export const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { query = {} } = req;

  delete query['limit'];
  delete query['page'];

  try {
    const invitations = await listInvitations(
      query,
      req.user._id,
      Number(query.limit) || undefined,
      Number(query.page) || undefined,
    );
    return res.json(invitations);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { body } = req;

  try {
    const insert = await createInvitation({ ...body, user: req.user._id });
    return res.status(201).json({ _id: insert });
  } catch (err) {
    return next(err);
  }
};

export const get = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const template = await getInvitation(id, req.user._id);
    return res.json(template);
  } catch (err) {
    return next(err);
  }
};

export const saveInvitation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const invitationImage = req.files as any[];
    return res.json(invitationImage.map((d) => ({ key: d.key, originalname: d.originalname })));
  } catch (err) {
    return next(err);
  }
};
