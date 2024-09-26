import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';
import { config } from './config/config';
import { Logger } from './library/Logger';
import { AppError, getCelebrateErrorMessage } from './helpers';
import { appRoutes } from './routes';
import { RedisService } from './services/redisService';

const app = express();

// MongoDB
mongoose
  .connect(config.mongo.url, {
    retryWrites: true,
    w: 'majority',
    dbName: 'fixture-api-db',
  })
  .then(() => {
    Logger.info('MongoDB connected');
    startServer();
  })
  .catch((error) => {
    Logger.error('MongoDB connection error');
    Logger.error(error);
  });

new RedisService();

const startServer = () => {
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

  http.createServer(app).listen(config.server.port, () => {
    Logger.info(`Server is running on PORT: ${config.server.port}`);
  });
};
