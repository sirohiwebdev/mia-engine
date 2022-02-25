import { GatewayEvents, PaymentEntity } from './../../services/razorpay';
export type PaymentVerificationProps = {
  event: typeof GatewayEvents;
  payload: {
    payment: {
      entity: PaymentEntity;
    };
    order: {
      entity: any;
    };
  };
  account_id: string;
  created_at: number;
  user: string;
};

export const verifyPayment = async (props: PaymentVerificationProps) => {
  return true;
};
