import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

export enum PaymentState {
  CREATED = 'created',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export interface IPayment extends RootObject {
  user: string;
  amount: number;
  plan: string;
  subscription: string;
  status: PaymentState;
  razorpayId: string | null;
}

export const paymentSchema: Joi.Schema<IPayment> = Joi.object<IPayment>({
  amount: Joi.number().required().min(0),
  user: Joi.string().required(),
  plan: Joi.string().required(),
  subscription: Joi.string().required(),
  status: Joi.string().valid(...Object.values(PaymentState)),
  razorpayId: Joi.string().default(null),
}).required();

export default class Payment extends BaseModel<IPayment> {
  constructor(db: Db) {
    super(db);
    this.schema = paymentSchema;
    this.collection = Collections.payments;
  }
}
