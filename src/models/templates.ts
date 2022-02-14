import { IInvitationTemplateData, InvitationTemplateContent } from '@sirohiwebdev/mia-core';
import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

export interface ITemplate extends IInvitationTemplateData, RootObject {
  type: 'image' | 'video';
  thumbnail: string;
  event: string;
  image?: string;
  video?: string;
}

export const templateContentSchema: Joi.ObjectSchema<InvitationTemplateContent> = Joi.object({
  id: Joi.string(),
  type: Joi.string().valid('image', 'icon', 'text').required(),
  x: Joi.number().required(),
  y: Joi.number().required(),
  w: Joi.number().required(),
  h: Joi.number().required(),
  source: Joi.string().default('').allow(''),
  label: Joi.string().required(),
  properties: Joi.object<InvitationTemplateContent['properties']>({
    fontSize: Joi.number(),
    fontFamily: Joi.string(),
    fontWeight: Joi.alt(Joi.string(), Joi.number()),
    fontStyle: Joi.string(),
    color: Joi.string(),
    backgroundColor: Joi.string(),
  }).required(),
});
export const templateSchema: Joi.ObjectSchema<ITemplate> = Joi.object({
  type: Joi.string().valid('image', 'video').required(),
  event: Joi.string().required(),
  id: Joi.string(),
  thumbnail: Joi.string().required(),
  image: Joi.string().required(),
  name: Joi.string().required(),
  width: Joi.number().required(),
  height: Joi.number().required(),
  layout: Joi.string().valid('landscape', 'portrait').required(),
  contents: Joi.array().items(templateContentSchema).required().min(1),
});

export default class Template extends BaseModel<ITemplate> {
  constructor(db: Db) {
    super(db);
    this.schema = templateSchema;
    this.collection = Collections.templates;
  }
}
