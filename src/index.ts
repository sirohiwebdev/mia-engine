import 'dotenv/config';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { initDB } from 'database/connect';

import { errorHandler } from './middleware';
import routes from './routes';
import { createAllDirectories } from './utils/create-dirs';

/**
 * Creat all required directories for the application
 */
createAllDirectories();

export const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
