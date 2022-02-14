import { differenceInSeconds } from 'date-fns';
import Joi from 'joi';
import { isEqual } from 'lodash';
import { Db } from 'mongodb';
import { v4 } from 'uuid';

import generateOtp, { OtpGeneratorOptions } from 'services/otp';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

interface IToken extends RootObject {
  // Iso Timestamp
  validUpto: string;
  token: string;
  validationSession: string;
  user: string; // User Id
}
export const tokenSchema = Joi.object<IToken>({
  validUpto: Joi.string().required().isoDate(),
  token: Joi.string().required(),
  validationSession: Joi.string().required(),
  user: Joi.string().required(),
});

export default class Token extends BaseModel<IToken> {
  constructor(db: Db) {
    super(db);
    this.schema = tokenSchema;
    this.collection = Collections.tokens;
  }

  /**
   * Create a token for validation against a user
   * @param user user-email
   * @param s time in seconds default to 300 seconds or 5 minutes
   */
  createToken = async (
    user: string,
    s = 300,
    length = 6,
    options: OtpGeneratorOptions = { digits: true, alphabets: false, specialChars: false, upperCase: false },
  ) => {
    const validationSession = v4();
    const validUpto = new Date(Date.now() + s * 1000).toISOString();
    const token = generateOtp(length, options);
    await this.insert({ user, validUpto, validationSession, token });

    return {
      validationSession,
      token,
    };
  };

  isValid = async (user, token: string, validationSession: string) => {
    const tokens = await this.find({ user, validationSession, is_deleted: false }, 1);
    console.log(tokens, user, token, validationSession);
    const [findToken] = tokens;
    if (!findToken) throw new Error(`Invalid session id or user`);
    if (differenceInSeconds(new Date(findToken.validUpto), Date.now()) < 2) {
      await this.delete(findToken._id);
      throw new Error(`Token expired try again`);
    }

    if (!isEqual(findToken.token, token)) {
      throw new Error(`Invalid token ${token}`);
    }

    await this.delete(findToken._id);
    return true;
  };
}
