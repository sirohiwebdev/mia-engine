import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

export interface IPlan extends RootObject {
  title: string;
  amount: number;
  type: 'starter' | 'pro' | 'ultimate';
  description: string;
  duration: number; // days
}

export const planSchema: Joi.Schema<IPlan> = Joi.object<IPlan>({
  type: Joi.string().valid('starter', 'pro', 'ultimate').required(),
  duration: Joi.number().required(),
  amount: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export default class Plan extends BaseModel<IPlan> {
  constructor(db: Db) {
    super(db);
    this.schema = planSchema;
    this.collection = Collections.plans;
  }
}
