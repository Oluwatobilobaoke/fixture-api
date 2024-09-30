import request from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config';
import { app } from '../src/server';

describe('Server Base URL', () => {
  beforeAll(async () => {
    // Connect to MongoDB before running tests
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
      dbName: config.mongo.dbNameTest, // Use a separate test database
    });
  });

  afterAll(async () => {
    // Disconnect from MongoDB after tests
    await mongoose.connection.close();
  });

  it('should return 200 for root path', async () => {
    try {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'API OK!! 👍🏽📌',
      );
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

  it('should return 200 for health check', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'OK');
  });
});
