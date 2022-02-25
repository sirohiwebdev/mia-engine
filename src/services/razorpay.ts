import { createHmac } from 'crypto';

import { round, isEqual } from 'lodash';
import Razorpay from 'razorpay';

// TODO remove secret from here
const secret = 'iTesaK@NVmbbU9n';

export interface PaymentEntity {
  id: string;
  entity: 'payment';
  amount: number;
  currency: string;
  status: PaymentState;
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: any[];
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  created_at: number;
}

export enum PaymentState {
  CREATED = 'created',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export const GatewayEvents = {
  payment: {
    authorized: 'payment.authorized',
    captured: 'payment.captured',
    failed: 'payment.failed',
  },
  order: {
    created: 'order.created',
    paid: 'order.paid',
  },
};

class PaymentGateway {
  private razorpay: typeof Razorpay;
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });
  }

  get razorpayClient() {
    return this.razorpay;
  }

  createOrder = async ({
    amount,
    plan,
    user,
    paymentId,
  }: {
    /**
     * Amount in rupees only
     */
    amount: number;
    /**
     * Selected Plan Id for user
     */
    plan: string;
    user: string;
    paymentId: string;
  }): Promise<{
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: any;
    status: PaymentState;
    attempts: number;
    notes: any;
    created_at: number;
  }> => {
    const order = this.razorpay.orders.create({
      amount: round(amount * 100, 2),
      currency: 'INR', // Keeping INR for now
      receipt: paymentId,
      notes: {
        userId: user,
        plan,
      },
    });
    return order;
  };

  validateSignature = (data, signature) => {
    const sha = createHmac('sha256', secret);
    const expected = sha.update(data).digest('hex');
    return isEqual(expected, signature);
  };
}

export const gateway = new PaymentGateway();

// gateway
//   .createOrder({ user: 'test', paymentId: 'test-payment-id', plan: 'test-plan', amount: 249 })
//   .then(console.log)
//   .catch(console.error);
