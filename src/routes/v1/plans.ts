import { Router } from 'express';
import { body } from 'express-validator';

import { createPlan, list } from 'controllers/plan';

import { checkRole, checkJwt } from '../../middleware';

const router = Router();

router.get('/', async (req, res, next) => {
  const { query = {} } = req;
  delete query['limit'];
  delete query['page'];

  const getList = await list(query, Number(query.limit) || undefined, Number(query.page) || undefined);

  return res.json(getList);
});

router.post(
  '/',
  checkJwt,
  checkRole(['ADMIN']),
  [body(['title', 'amount', 'description', 'duration', 'type']).exists()],
  async (req, res, next) => {
    const { body } = req;
    const plan = await createPlan(body);
    return res.json(plan);
  },
);

export default router;
