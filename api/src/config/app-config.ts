export default {
  PORT: 5000,
  MONGO_URI:
    process.env.MONGO_URI ||
    'mongodb+srv://moonactive.n96tom9.mongodb.net/?retryWrites=true&w=majority',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'operation_team',
  MONGO_DB_USER: process.env.MONGO_DB_USER || 'admin',
  MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD || 'FO8uTx2nOwjebahl',
};
