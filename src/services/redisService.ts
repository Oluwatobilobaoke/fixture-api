import Redis from 'ioredis';
import { config } from '../config/config';
import { Logger } from '../library/Logger';

class RedisService {
  public client;

  constructor() {
    const url = config.redis.url;
    this.client = new Redis(url);

    this.client.on('connect', () => {
      Logger.info('Redis connected');
    });

    this.client.on('error', (error) => {
      console.error('Redis error');
      Logger.error('Redis error');
      Logger.error(error);
    });
  }

  async setCache(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  // set with expiration
  async setex(
    key: string,
    value: any,
    expiration: number,
  ): Promise<void> {
    await this.client.setex(key, expiration, JSON.stringify(value));
  }

  // Example method for getting a value
  async getCache(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // create key for saving data
  createKey(key: string, id: any): string {
    return `${key}:${id}`;
  }
}

export default new RedisService();
