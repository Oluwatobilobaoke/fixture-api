import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { config } from './config/config';
import { Logger } from './library/Logger';
import { AppError, getCelebrateErrorMessage } from './helpers';
import { appRoutes } from './routes';
import redisService from './services/redisService';

const redisClient = redisService.client;

const app = express();

// Configure app
const configureApp = () => {
  app.use((req, res, next) => {
    Logger.info(
      `Incoming - Method: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress}`,
    );
    req.on('finish', () => {
      Logger.info(
        `Incoming - Method: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress} - Response: ${res.statusCode}`,
      );
    });

    next();
  });

  // Set up Redis-based session store
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
    ttl: 86400, // 1 day TTL
  });

  // Configure session middleware
  app.use(
    session({
      store: redisStore,
      secret: config.session.secret, // Replace with your own secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // Session expires in 1 day
      },
    }),
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // API RULES
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET',
      );
      return res.status(200).json({});
    }

    next();
  });

  // ROUTES
  appRoutes(app);

  // DEFAULT
  app.get('/', (req, res) => {
    return res.status(200).json({
      message: 'API OK!! 👍🏽📌',
    });
  });

  // HEALTH CHECK
  app.get('/health', (req, res) => {
    return res.status(200).json({
      message: 'OK',
    });
  });

  // DEFAULT
  app.get('/', (req, res) => {
    return res.status(200).json({
      message: 'API OK!! 👍🏽📌',
    });
  });

  // ERROR HANDLING
  app.use((req, res, next) => {
    const error = new Error('Not found');
    Logger.error(error);

    return res.status(404).json({
      message: error.message,
    });
  });

  // @ts-ignore
  app.use((err, req, res, next) => {
    if (isCelebrateError(err)) {
      const message = getCelebrateErrorMessage(err);
      err = new AppError(422, message);
    } else if (!err.code) {
      Logger.info(
        '\n******************* SERVER ERROR *******************',
      );
      Logger.error(err);
      Logger.info(
        '*****************************************************\n',
      );
      err = new AppError(500, 'Something went wrong', err);
    }
    res.status(err.code).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  });
};

// MongoDB
mongoose
  .connect(config.mongo.url, {
    retryWrites: true,
    w: 'majority',
    dbName: config.mongo.dbName,
  })
  .then(() => {
    Logger.info('MongoDB connected');
    configureApp();
  })
  .catch((error) => {
    Logger.error('MongoDB connection error');
    Logger.error(error);
  });

const startServer = () => {
  http.createServer(app).listen(config.server.port, () => {
    Logger.info(`Server is running on PORT: ${config.server.port}`);
  });
};

configureApp(); // Configure app immediately for testing purposes

export { app, startServer };
