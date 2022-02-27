import { getDb } from 'database/connect';
import { SubscriptionModel } from 'models';

export const activateSubscription = async ({ subscription }: { subscription: string }) => {
  /// test
  const subscriptionModel = new SubscriptionModel(getDb());
  await subscriptionModel.update(subscription, { active: true });
  return true;
};
