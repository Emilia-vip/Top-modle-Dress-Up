import { Collection, MongoClient } from 'mongodb';
import pino from 'pino';
import dotenv from 'dotenv';
import { UserDatabaseModel } from '../users/types';
import { OutfitDatabaseModel } from '../outfits/types';
import { RatingDatabaseModel } from '../ratings/types';

dotenv.config();

class MongoConnection {
  private static dbClient: MongoClient | null = null;
  private static logger = pino();

  private constructor() {}

  static async getDbClient(): Promise<MongoClient> {
    if (!this.dbClient) {
      if (!process.env.MONGODB_URI) throw new Error('NO MONGODB_URI SET!');

      this.logger.info('Connecting to DB!');
      this.dbClient = new MongoClient(process.env.MONGODB_URI);

      try {
        await this.dbClient.connect();
        this.logger.info('Connected to DB');
      } catch (err) {
        this.logger.error({ err }, 'Failed to connect to DB');
        this.dbClient = null;
        throw err;
      }
    }
    return this.dbClient;
  }

  private static getDbName(): string {
    const dbName = process.env.MONGODB_DB || process.env.MONGO_DATABASE;
    if (!dbName) throw new Error('NO MONGODB_DB OR MONGO_DATABASE SET!');
    return dbName;
  }

  static async userCollection(): Promise<Collection<UserDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = this.getDbName();
    return client.db(dbName).collection<UserDatabaseModel>('Users');
  }

  static async outfitsCollection(): Promise<Collection<OutfitDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = this.getDbName();
    return client.db(dbName).collection<OutfitDatabaseModel>('outfits');
  }

  static async ratingsCollection(): Promise<Collection<RatingDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = this.getDbName();
    return client.db(dbName).collection<RatingDatabaseModel>('ratings');
  }

  static async close(): Promise<void> {
    if (this.dbClient) {
      await this.dbClient.close();
      this.dbClient = null;
      this.logger.info('Database connection closed');
    }
  }
}

export default MongoConnection;