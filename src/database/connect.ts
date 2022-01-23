import { MongoClient, Db } from 'mongodb';

const mongoDbUser = process.env.DB_USER;
const mongoDbPassword = process.env.DB_PASSWORD;
const mongoDbHost = process.env.DB_HOST;
const mongoDbPort = process.env.DB_PORT;
const mongoDbName = process.env.DB_NAME;

const uri = `mongodb+srv://${mongoDbUser}:${mongoDbPassword}@${mongoDbHost}/${mongoDbName}?retryWrites=true&w=majority`;
let _db: Db;
export const initDB = async (): Promise<Db> => {
  if (_db) {
    console.warn('Initializing db again');
    return _db;
  }
  const client = await MongoClient.connect(uri);
  const db = client.db(mongoDbName);
  console.log('Connected to MongoDB');
  _db = db;
  return db;
};

export const getDb = () => _db;
