import { getDb } from 'database/connect';
import { PaymentModel, PlanModel } from 'models';
import { gateway } from 'services/razorpay';

import { PaymentStatus } from '../../models/payment';

export const makePaymentForSubscription = async ({ user, plan }: { user: string; plan: string }) => {
  // first is create a raw payment

  const paymentModel = new PaymentModel(getDb());
  const planModel = new PlanModel(getDb());
  const selectedPlan = await planModel.get(plan);

  const newPayment = await paymentModel.insert({
    user,
    plan,
    amount: selectedPlan.amount,
    status: PaymentStatus.PENDING,
  });

  /// now create an order for this payment
  const paymentOrder = await gateway.createOrder({ amount: selectedPlan.amount, plan, user, paymentId: newPayment });

  // add razorpayId to payment
  await paymentModel.update(newPayment, { razorpayId: paymentOrder.id });

  return {
    ...paymentOrder,
    key: process.env.RAZORPAY_KEY_ID,
  };
};
