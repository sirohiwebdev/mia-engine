import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

export interface ISubscription extends RootObject {
  subscriptionDate: string;
  plan: string;
  user: string;
}

export const subscriptionSchema: Joi.Schema<ISubscription> = Joi.object<ISubscription>({
  plan: Joi.string().required(),
  subscriptionDate: Joi.string().required().isoDate(),
  user: Joi.string().required(),
});

export default class Subscription extends BaseModel<ISubscription> {
  constructor(db: Db) {
    super(db);
    this.schema = subscriptionSchema;
    this.collection = Collections.subscriptions;
  }
}
