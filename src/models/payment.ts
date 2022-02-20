import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface IPayment extends RootObject {
  user: string;
  amount: number;
  subscription: string;
  status: PaymentStatus;
}

export const paymentSchema: Joi.Schema<IPayment> = Joi.object<IPayment>({
  amount: Joi.number().required().min(0),
  user: Joi.string().required(),
  subscription: Joi.string().required(),
  status: Joi.string().valid(...Object.values(PaymentStatus)),
}).required();

export default class Payment extends BaseModel<IPayment> {
  constructor(db: Db) {
    super(db);
    this.schema = paymentSchema;
    this.collection = Collections.payments;
  }
}
