import { getDb } from 'database/connect';
import { IPlan, PlanModel } from 'models';

export const get = async (id: string) => {
  const db = getDb();
  const planModel = new PlanModel(db);
  return await planModel.get(id);
};
