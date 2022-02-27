import { makePaymentForSubscription } from 'controllers/payment';

import { createSubscription } from './create';

export const buySubscription = async ({ user, plan }: { user: string; plan: string }) => {
  const subscription = await createSubscription({
    plan,
    user,
    subscriptionDate: new Date().toISOString(),
    renewalDate: null,
    active: false,
  });

  const paymentData = await makePaymentForSubscription({ user, subscription, plan });

  return paymentData;
};
