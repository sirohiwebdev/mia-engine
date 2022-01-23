import { ObjectId, Timestamp } from 'bson';
import Joi from 'joi';
import { Db, Filter, OptionalId, WithId } from 'mongodb';

export type WithTimeStamp<T> = T & {
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
};

import Collections from './_collections';

export default class BaseModel<T> {
  protected db: Db;
  protected schema?: Joi.Schema;
  //   protected client: MongoClient;
  protected collection: Collections;

  constructor(db: Db) {
    this.db = db;
    // this.client = client;
  }

  protected get dbCollection() {
    return this.db.collection<WithTimeStamp<T>>(this.collection);
  }

  getCount = async (): Promise<number> => {
    return this.dbCollection.countDocuments();
  };

  find(query: Filter<WithTimeStamp<T>> = {}, limit = 20, offset = 1): Promise<WithId<WithTimeStamp<T>>[]> {
    return this.dbCollection.find(query, { limit, skip: limit * (offset - 1) }).toArray();
  }

  get = async (id): Promise<WithId<WithTimeStamp<T>> | null> => {
    return this.dbCollection.findOne({ _id: new ObjectId(id) });
  };

  getMany = (query: Filter<WithTimeStamp<T>> = {}, limit = 100, offset = 0): Promise<WithId<WithTimeStamp<T>>[]> => {
    return this.dbCollection.find(query, { limit, skip: limit * offset }).toArray();
  };

  insert = async (item: OptionalId<Omit<WithTimeStamp<T>, 'created_at' | 'updated_at'>>): Promise<string> => {
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
    } as unknown as OptionalId<WithTimeStamp<T>>;

    const insert = await this.dbCollection.insertOne(insertItem);
    return insert.insertedId.toHexString();
  };

  insertMany = async (items: OptionalId<WithTimeStamp<T>>[]): Promise<string[]> => {
    items = items.map((item) => ({ ...item, created_at: new Date().toISOString() }));
    const inserted = await this.dbCollection.insertMany(items);
    return Object.values(inserted.insertedIds).map((id) => id.toHexString());
  };

  update = async (id: string, data: Partial<WithTimeStamp<T>>): Promise<boolean> => {
    const update = await this.dbCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updated_at: new Date().toISOString() } },
    );
    return Boolean(update.ok);
  };

  remove = async (id: string): Promise<boolean> => {
    const remove = await this.dbCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    return Boolean(remove.ok);
  };

  delete = async (id: string | ObjectId): Promise<boolean> => {
    const d = await this.dbCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      // @ts-ignore
      { $set: { is_deleted: true } },
      { upsert: true },
    );
    return Boolean(d);
  };
}
