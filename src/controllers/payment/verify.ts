import { activateSubscription } from 'controllers/subscription/';
import { getDb } from 'database/connect';
import { PaymentModel, PaymentState } from 'models';

import { GatewayEvents, OrderEntity, PaymentEntity } from './../../services/razorpay';
export type PaymentVerificationProps = {
  event: string;
  payload: {
    payment: {
      entity: PaymentEntity;
    };
    order: {
      entity: OrderEntity;
    };
  };
  account_id: string;
  created_at: number;
};

export const verifyPayment = async (props: PaymentVerificationProps) => {
  const { event, payload } = props;

  if (event === GatewayEvents.order.paid) {
    console.log('order is paid');
    const { order, payment } = payload;
    const { receipt: paymentId, status: orderStatus } = order.entity;
    const { status: paymentStatus } = payment.entity;

    const paymentModel = new PaymentModel(getDb());

    const { subscription } = await paymentModel.get(paymentId);
    await paymentModel.update(paymentId, { status: paymentStatus });

    if (paymentStatus === PaymentState.CAPTURED && orderStatus === 'paid') {
      console.log('Payment captured and order paid');
      await activateSubscription({ subscription });
    }

    return true;
    // Payment is authorized and activate the subscription
  }
  return false;
};
