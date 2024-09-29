import Redis from 'ioredis';
import { config } from '../config/config';
import { Logger } from '../library/Logger';

export class RedisService {
  private client;

  constructor() {
    this.client = new Redis({
      port: parseInt(config.redis.port, 10),
      host: config.redis.host,
    });

    this.client.on('connect', () => {
      Logger.info('Redis connected');
    });

    this.client.on('error', (error) => {
      console.error('Redis error');
      Logger.error('Redis error');
      Logger.error(error);
    });
  }

  async setCache(key: string, value: string): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  // set with expiration
  async setex(
    key: string,
    value: string,
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
  createKey(key: string): string {
    return `${key}:${new Date().getTime()}`;
  }


  // save team data to cache
  async saveTeamToCache(key: string, value: any): Promise<void> {
    await this.setCache(key, JSON.stringify(value));
  }

  // get team data from cache
  async getTeamFromCache(key: string): Promise<any> {
    const team = await this.getCache(key);
    return team ? JSON.parse(team) : null;
  }

  // save fixtures data to cache
  async saveFixturesToCache(key: string, value: any): Promise<void> {
    await this.setCache(key, JSON.stringify(value));
  }

  // get fixtures data from cache
  async getFixturesFromCache(key: string): Promise<any> {
    const fixtures = await this.getCache(key);
    return fixtures ? JSON.parse(fixtures) : null
  }

  // Other Redis methods...
}
