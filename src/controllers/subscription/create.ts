import { getDb } from 'database/connect';
import { ISubscription, SubscriptionModel } from 'models';

export const createSubscription = async (subscription: ISubscription) => {
  const db = getDb();
  const invitationModel = new SubscriptionModel(db);

  return await invitationModel.insert(subscription);
};
