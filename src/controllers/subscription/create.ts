import { getDb } from 'database/connect';
import { ISubscription, SubscriptionModel } from 'models';
import { RootObject } from 'models/_base';

export const createSubscription = async (subscription: Omit<ISubscription, keyof RootObject>) => {
  const db = getDb();
  const invitationModel = new SubscriptionModel(db);

  return await invitationModel.insert(subscription);
};
