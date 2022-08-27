import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

export interface ISubscription extends RootObject {
  plan: string;
  user: string;
  subscriptionDate: string | null;
  renewalDate: string;
  active: boolean;
}

export const subscriptionSchema: Joi.Schema<ISubscription> = Joi.object<ISubscription>({
  plan: Joi.string().required(),
  subscriptionDate: Joi.string().required().isoDate(),
  renewalDate: Joi.string().allow(null).isoDate(),
  user: Joi.string(),
  active: Joi.boolean().required().default(false),
});

export default class Subscription extends BaseModel<ISubscription> {
  constructor(db: Db) {
    super(db);
    this.schema = subscriptionSchema;
    this.collection = Collections.subscriptions;
  }
}
