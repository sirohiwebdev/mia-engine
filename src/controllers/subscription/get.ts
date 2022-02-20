import { getDb } from 'database/connect';
import { ISubscription, SubscriptionModel } from 'models';

export const get = async (props: { user: string; _id: string }) => {
  const db = getDb();
  const subscription = new SubscriptionModel(db);
  const findSubs = await subscription.find(props);

  return findSubs[0];
};
