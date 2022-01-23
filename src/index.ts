import 'dotenv/config';
import 'reflect-metadata';
import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { initDB } from 'database/connect';

import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
export const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

try {
  const accessLogStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), {
    flags: 'a',
  });
  app.use(morgan('combined', { stream: accessLogStream }));
} catch (err) {
  console.log(err);
}
app.use(morgan('combined'));

app.use('/', routes);

app.use(errorHandler);

const initApp = () => {
  console.log('Initializing App');
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

initDB()
  .then(initApp)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
