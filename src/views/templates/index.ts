import { NextFunction, Response } from 'express';

import { createTemplate, listTemplates } from 'controllers/templates';
import { getDb } from 'database/connect';
import Template from 'models/templates';
import { AuthenticatedRequest } from 'types/JwtPayload';

export const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { query } = req;
  delete query['limit'];
  delete query['page'];
  try {
    const templates = await listTemplates(query, Number(query.limit) || undefined, Number(query.page) || undefined);
    return res.json(templates);
  } catch (err) {
    return next(err);
  }
};

export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { body } = req;

  try {
    const insert = await createTemplate(body);
    return res.status(201).json({ _id: insert });
  } catch (err) {
    return next(err);
  }
};

export const get = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const db = getDb();
  const templateModel = new Template(db);
  try {
    const template = await templateModel.get(id);
    return res.json(template);
  } catch (err) {
    return next(err);
  }
};

export const saveTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const thumbnail = req.files['thumbnail'][0];
    const image = req.files['image'][0];

    console.dir({ thumbnail, image }, { depth: 20 });

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};
