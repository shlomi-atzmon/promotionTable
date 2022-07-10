import { DatabaseConnectionError } from './errors/database-connection-error';
import mongoose from 'mongoose';
import app from './app';

const initiateApp = async () => {
  // Connect to MongoDB
  try {
    // TODO: Add best practice on config
    await mongoose.connect(
      'mongodb+srv://moonactive.n96tom9.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'operation_team',
        user: 'admin',
        pass: 'FO8uTx2nOwjebahl',
      }
    );
    console.log('Promotion service is connected to MongoDB');
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(5000, () => {
    console.log('Promotion service listening on port 5000!');
  });
};

initiateApp();
