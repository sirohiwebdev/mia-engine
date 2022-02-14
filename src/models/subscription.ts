import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

interface ISubscription extends RootObject {
  type: 'free' | 'paid';
  // Iso Timestamp
  validUpto: string;
  subscriptionDate: string;
  amount: number;
  user: string; // User Id
}
export const subscriptionSchema = Joi.object<ISubscription>({
  type: Joi.string().valid('free', 'paid').required(),
  validUpto: Joi.string().required().isoDate(),
  subscriptionDate: Joi.string().required().isoDate(),
  amount: Joi.number().required(),
  user: Joi.string().required(),
});

export default class Subscription extends BaseModel<ISubscription> {
  constructor(db: Db) {
    super(db);
    this.schema = subscriptionSchema;
    this.collection = Collections.subscriptions;
  }
}
