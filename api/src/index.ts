import { DatabaseConnectionError } from './errors/database-connection-error';
import mongoose from 'mongoose';
import appConfig from './config/app-config';
import app from './app';

const initiateApp = async () => {
  try {
    await mongoose.connect(appConfig.MONGO_URI, {
      dbName: appConfig.MONGO_DB_NAME,
      user: appConfig.MONGO_DB_USER,
      pass: appConfig.MONGO_DB_PASSWORD,
    });
    console.log('Promotion service is connected to MongoDB');
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(appConfig.PORT, () => {
    console.log(`Promotion service listening on port ${appConfig.PORT}!`);
  });
};

initiateApp();
