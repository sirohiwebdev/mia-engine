import path from 'path';

import { NextFunction, Response } from 'express';
import Jimp from 'jimp';

import { createTemplate, listTemplates } from 'controllers/templates';
import { getDb } from 'database/connect';
import Template, { ITemplate } from 'models/templates';
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
  const { template } = req.body;

  const thumbnail = req.files['thumbnail'][0] as Express.MulterS3.File;
  const image = req.files['image'][0] as Express.MulterS3.File;

  const temp = JSON.parse(template);

  console.log(thumbnail, image);

  const templateData: ITemplate = {
    ...temp,
    thumbnail: thumbnail.key,
    image: image.key,
  };

  try {
    const insert = await createTemplate(templateData);
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

    const {
      bitmap: { width: tWidth, height: tHeight },
    } = await Jimp.read(path.join(__dirname, '../../..', thumbnail.path));
    const {
      bitmap: { width, height },
    } = await Jimp.read(path.join(__dirname, '../../..', image.path));

    return res.json({
      thumbnail: { ...thumbnail, width: tWidth, height: tHeight },
      image: { ...image, width, height },
    });
  } catch (err) {
    return next(err);
  }
};
