import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { Db } from 'mongodb';

import BaseModel from './_base';
import Collections from './_collections';

type UserRole = 'ADMIN' | 'USER';

interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
export const userSchema = Joi.object<IUser>({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  role: Joi.string().required().valid('USER', 'ADMIN'),
});

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

  login = async (email: string, password: string) => {
    const user = await this.dbCollection.findOne({ email: email });
    if (!user) throw new Error(`Not found`);
    const isValidPassword = User.isMatchPassword(password, user.password);
    if (!isValidPassword) throw new Error(`Password does not match for email ${email}`);
    return user;
  };

  register = async (user: IUser) => {
    const found = await this.dbCollection.findOne({ email: user.email });

    if (found) {
      throw new Error(`User already registered: ${user.email}`);
    }

    user.password = User.hashPassword(user.password);

    return await this.insert(user);
  };

  changePassword = async (id: string, newPassword: string, oldPassword: string) => {
    const found = await this.dbCollection.findOne({ id: id });
    if (!found) throw new Error(`Not found`);
    if (!User.isMatchPassword(oldPassword, found.password)) {
      throw new Error(`Old password ${oldPassword} does not match.`);
    }
    return await this.update(found._id.toHexString(), { password: User.hashPassword(newPassword) });
  };

  resetPassword = async (id: string, password: string) => {
    return await this.update(id, { password: User.hashPassword(password) });
  };
}
