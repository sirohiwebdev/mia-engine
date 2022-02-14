import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';
import { ITemplate, templateContentSchema } from './templates';
export interface IInvitation extends RootObject {
  user: string;
  template: string;
  contents: ITemplate['contents'];
  contacts: string[];
  message: string;
  type: ITemplate['type'];
}

export const invitationSchema: Joi.ObjectSchema<IInvitation> = Joi.object({
  user: Joi.string().required(),
  template: Joi.string().required(),
  contents: Joi.array().items(templateContentSchema).required(),
  contacts: Joi.array().items(Joi.string().required()).required(),
  message: Joi.string().required(),
  type: Joi.string().valid('image', 'video').required(),
});

export default class Invitation extends BaseModel<IInvitation> {
  constructor(db: Db) {
    super(db);
    this.schema = invitationSchema;
    this.collection = Collections.invitations;
  }
}
