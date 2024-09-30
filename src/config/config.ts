import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI ?? '';
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 13019;
const JWT_SECRET = process.env.JWT_SECRET ?? '';
const REDIS_HOST = process.env.REDIS_HOST ?? '';
const REDIS_PORT = process.env.REDIS_PORT ?? '';
const SESSION_SECRET = process.env.SESSION_SECRET ?? '';

export const config = {
  mongo: {
    url: MONGO_URI,
  },
  server: {
    port: SERVER_PORT,
  },
  jwt: {
    secret: JWT_SECRET,
  },
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  session: {
    secret: SESSION_SECRET,
  },
};
