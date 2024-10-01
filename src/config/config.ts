import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI ?? '';
const DB_NAME = process.env.DB_NAME ?? '';
const DB_NAME_TEST = process.env.DB_NAME_TEST ?? '';
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 13019;
const JWT_SECRET = process.env.JWT_SECRET ?? '';
const REDIS_URL = process.env.REDIS_URL ?? '';  
const REDIS_HOST = process.env.REDIS_HOST ?? '';
const REDIS_PORT = process.env.REDIS_PORT ?? '';
const SESSION_SECRET = process.env.SESSION_SECRET ?? '';

export const config = {
  mongo: {
    url: MONGO_URI,
    dbName: DB_NAME,
    dbNameTest: DB_NAME_TEST,
  },
  server: {
    port: SERVER_PORT,
  },
  jwt: {
    secret: JWT_SECRET,
  },
  redis: {
    url: REDIS_URL,
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  session: {
    secret: SESSION_SECRET,
  },
};
