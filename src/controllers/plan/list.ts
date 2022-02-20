import { getDb } from 'database/connect';
import { IPlan, PlanModel } from 'models';

export const list = async (query: any, limit?: number, offset?: number) => {
  const db = getDb();
  const planModel = new PlanModel(db);
  return await planModel.find(query, limit, offset);
};
