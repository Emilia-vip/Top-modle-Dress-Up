import { MongoClient } from 'mongodb';
import pino from 'pino';
import { OutfitDatabaseModel, UserDatabaseModel } from './types';

class MongoConnection {
  private static dbClient: MongoClient;
  private static logger = pino();

  private constructor() {}

  static async getDbClient(): Promise<MongoClient> {
    if (!this.dbClient) {
      if (!process.env.MONGODB_URI) throw 'NO MONGODB_URI SET!';

      this.logger.info('Connecting to DB!');
      this.dbClient = new MongoClient(process.env.MONGODB_URI);
      await this.dbClient.connect();
    }
    return this.dbClient;
  }

  static userCollection() {
    if (!this.dbClient) {
      throw new Error(
        'Database client not initialized. Call getDbClient() first.'
      );
    }
    return this.dbClient.db().collection<UserDatabaseModel>('users');
  }

  static productsCollection() {
    if (!this.dbClient) {
      throw new Error(
        'Database client not initialized. Call getDbClient() first.'
      );
    }
    return this.dbClient.db().collection('products');
  }

  static outfitsCollection() {
    if (!this.dbClient) {
      throw new Error(
        'Database client not initialized. Call getDbClient() first.'
      );
    }
    return this.dbClient.db().collection<OutfitDatabaseModel>('outfits');
  }
}

export default MongoConnection;
