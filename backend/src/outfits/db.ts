import { MongoClient, Collection } from 'mongodb';
import pino from 'pino';
import dotenv from 'dotenv';
import { OutfitDatabaseModel } from './types';
import { UserDatabaseModel } from '../types';

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
        // Rensa vid fel
        this.dbClient = null;
        throw err;
      }
    }
    return this.dbClient;
  }

  // Använd async så att vi garanterat har en ansluten klient
  static async userCollection(): Promise<Collection<UserDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = process.env.MONGODB_DB; 
    return client.db(dbName).collection<UserDatabaseModel>('Users');
  }

  static async outfitsCollection(): Promise<Collection<OutfitDatabaseModel>> {
    const client = await this.getDbClient();
    const dbName = process.env.MONGODB_DB;
    return client.db(dbName).collection<OutfitDatabaseModel>('outfits');
  }

  static async close(): Promise<void> {
    if (this.dbClient) {
      await this.dbClient.close();
      this.dbClient = null;
      this.logger.info('Database connection closed');
    }
  }
};

export default MongoConnection;

