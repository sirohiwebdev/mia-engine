import Joi from 'joi';
import { Db, Filter, OptionalId, WithId, ObjectId, Document, ModifyResult } from 'mongodb';

export interface RootObject extends Document {
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
  _id: ObjectId;
}

import Collections from './_collections';

export default class BaseModel<T extends RootObject> {
  protected db: Db;
  protected schema?: Joi.Schema;
  //   protected client: MongoClient;
  protected collection: Collections;

  constructor(db: Db) {
    this.db = db;
    // this.client = client;
  }

  protected get dbCollection() {
    return this.db.collection<T>(this.collection);
  }

  getCount = async (): Promise<number> => {
    return this.dbCollection.countDocuments();
  };

  find(query: Filter<T> = {}, limit = 20, offset = 1): Promise<WithId<T>[]> {
    return this.dbCollection.find(query, { limit, skip: limit * (offset - 1) }).toArray();
  }

  get = async (id: string) => {
    // @ts-ignore
    return this.dbCollection.findOne({ _id: new ObjectId(id) }) as Promise<WithId<T> | null>;
  };

  getMany = (query: Filter<T> = {}, limit = 100, offset = 0): Promise<WithId<T>[]> => {
    return this.dbCollection.find(query, { limit, skip: limit * offset }).toArray();
  };

  insert = async (item: OptionalId<Omit<T, 'created_at' | 'updated_at'>>): Promise<string> => {
    if (!this.schema) {
      console.log('Skipping schema validation, No Schema found');
    } else {
      console.log(item);
      await this.schema.validateAsync(item);
    }

    const insertItem = {
      ...item,
      created_at: new Date().toISOString(),
      is_deleted: false,
    } as any;

    const insert = await this.dbCollection.insertOne(insertItem);
    return insert.insertedId.toHexString();
  };

  insertMany = async (items: Omit<T, '_id'>[]): Promise<string[]> => {
    items = items.map((item) => ({ ...item, created_at: new Date().toISOString() }));
    const inserted = await this.dbCollection.insertMany(items as any);
    return Object.values(inserted.insertedIds).map((id) => id.toHexString());
  };

  update = async (id: string, data: Partial<Omit<T, '_id'>>): Promise<boolean> => {
    const update = (await this.dbCollection.findOneAndUpdate(
      // @ts-ignore
      { _id: new ObjectId(id) },
      { $set: { ...data, updated_at: new Date().toISOString() } },
    )) as unknown as ModifyResult<T>;
    return Boolean(update.ok);
  };

  remove = async (id: string): Promise<boolean> => {
    const remove = (await this.dbCollection.findOneAndDelete(
      // @ts-ignore
      { _id: new ObjectId(id) },
    )) as unknown as ModifyResult<T>;
    return Boolean(remove.ok);
  };

  delete = async (id: string | ObjectId): Promise<boolean> => {
    const d = await this.dbCollection.findOneAndUpdate(
      // @ts-ignore
      { _id: new ObjectId(id) },
      // @ts-ignore
      { $set: { is_deleted: true } },
      { upsert: true },
    );
    return Boolean(d);
  };
}
