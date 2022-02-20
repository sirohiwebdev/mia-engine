import { getDb } from 'database/connect';
import { IPlan, PlanModel } from 'models';

export const createPlan = async (props: IPlan) => {
  const db = getDb();
  const invitationModel = new PlanModel(db);

  return await invitationModel.insert(props);
};
