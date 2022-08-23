import { NextFunction, Request, Response } from 'express';

import { Caricature } from '../../services/caricature';

export const generate = async (req: Request, res: Response, next: NextFunction) => {
  const caricature = new Caricature();

  const file = req.file;

  console.log(file);
  try {
    const data = await caricature.generateCaricature(file);

    return res.json({ imagePath: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: String(e),
    });
  }
};
