import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { Db, Filter } from 'mongodb';

import BaseModel, { RootObject } from './_base';
import Collections from './_collections';

import { ValidationError } from '../lib/errors';

export type UserRole = 'ADMIN' | 'USER';

interface IUser extends RootObject {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
}

export const userSchema = Joi.object<IUser>({
  name: Joi.string().required(),
  mobile: Joi.string().allow(null),
  email: Joi.string().email().allow(null),
  password: Joi.string().required().min(8),
  role: Joi.string().required().valid('USER', 'ADMIN'),
});

userSchema.validateAsync({ name: 'A', email: null, password: '122345533231', role: 'USER' });

export default class User extends BaseModel<IUser> {
  constructor(db: Db) {
    super(db);
    this.schema = userSchema;
    this.collection = Collections.users;
  }

  static hashPassword(password: string) {
    return bcrypt.hashSync(password, 8);
  }

  static isMatchPassword(plainPassword: string, hashPassword: string) {
    return bcrypt.compareSync(plainPassword, hashPassword);
  }

  login = async (params: Pick<IUser, 'email' | 'password' | 'role' | 'mobile'>) => {
    const q: Filter<IUser> = JSON.parse(JSON.stringify({ ...params, password: undefined }));
    const user: IUser | null = await this.dbCollection.findOne(q);
    if (!user) throw new ValidationError(`User not found`);
    const isValidPassword = User.isMatchPassword(params.password, user.password);
    if (!isValidPassword) throw new ValidationError(`Password does not match`);
    return user;
  };

  register = async (params: Pick<IUser, 'email' | 'password' | 'name' | 'role' | 'mobile'>) => {
    const { email, mobile, role, name } = params;
    const q: Filter<IUser> = JSON.parse(JSON.stringify({ email, mobile, role }));

    const found = await this.dbCollection.findOne(q);

    if (found) {
      throw new Error(`User already registered: ${q.email || q.mobile}`);
    }

    q.password = User.hashPassword(params.password);
    q.name = name;
    return await this.insert(q);
  };

  changePassword = async (id: string, newPassword: string, oldPassword: string) => {
    const found = await this.dbCollection.findOne({ id: id });
    if (!found) throw new Error(`User not found`);
    if (!User.isMatchPassword(oldPassword, found.password)) {
      throw new Error(`Old password ${oldPassword} does not match.`);
    }
    return await this.update(found._id.toHexString(), { password: User.hashPassword(newPassword) });
  };

  resetPassword = async (id: string, password: string) => {
    return await this.update(id, { password: User.hashPassword(password) });
  };
}
