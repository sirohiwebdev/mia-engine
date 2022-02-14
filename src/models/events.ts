import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

export interface IEvent extends RootObject {
  name: string;
  description: string;
  images: string[];
}

export const eventSchema = Joi.object<IEvent>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required().min(1),
});

export default class Event extends BaseModel<IEvent> {
  constructor(db: Db) {
    super(db);
    this.schema = eventSchema;
    this.collection = Collections.events;
  }
}
