import { Collection, MongoClient } from 'mongodb';
import pino from 'pino';
import dotenv from 'dotenv';
import { OutfitDatabaseModel, UserDatabaseModel } from './types';
import { RatingDatabaseModel } from './ratings/types';

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

  // Users collection
  static async userCollection(): Promise<Collection<UserDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = process.env.MONGODB_DB;
    if (!dbName) throw new Error('NO MONGODB_DB SET!');
    return client.db(dbName).collection<UserDatabaseModel>('Users');
  }

  // Outfits collection
  static async outfitsCollection(): Promise<Collection<OutfitDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = process.env.MONGODB_DB;
    if (!dbName) throw new Error('NO MONGODB_DB SET!');
    return client.db(dbName).collection<OutfitDatabaseModel>('outfits');
  }

  // Ratings collection
  static async ratingsCollection(): Promise<Collection<RatingDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = process.env.MONGODB_DB;
    if (!dbName) throw new Error('NO MONGODB_DB SET!');
    return client.db(dbName).collection<RatingDatabaseModel>('ratings');
  }

  // Stäng alla anslutningar
  static async close(): Promise<void> {
    if (this.dbClient) {
      await this.dbClient.close();
      this.dbClient = null;
      this.logger.info('Database connection closed');
    }
  }
}

export default MongoConnection;