import MongoConnection from './db';
import { OutfitDatabaseModel, Rating, UserDatabaseModel } from './types';

export const insertUser = async (user: UserDatabaseModel) => {
  return await MongoConnection.userCollection().insertOne(user);
};

export const findUserByUsername = async (username: string) => {
  return await MongoConnection.userCollection().findOne({ username: username });
};

export const findUserById = async (id: string) => {
  return await MongoConnection.userCollection().findOne({ _id: id });
};

export const getAllProducts = async () => {
  return await MongoConnection.productsCollection().find({}).toArray();
};

export const findProductById = async (id: number) => {
  return await MongoConnection.productsCollection().findOne({ _id: id });
};

export const updateProduct = async (
  id: number,
  updates: {
    username?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
  }
) => {
  return await MongoConnection.productsCollection().updateOne(
    { _id: id },
    { $set: updates }
  );
};

// Outfit related repository methods

export const insertOutfit = async (outfit: OutfitDatabaseModel) => {
  return await MongoConnection.outfitsCollection().insertOne(outfit);
};

// Replace the outfit for a username (keeps only one per user)
export const getAllOutfits = async () => {
  return await MongoConnection.outfitsCollection().find({}).toArray();
};

export const getOutfitsByUserId = async (userId: string) => {
  // Here `userId` corresponds to the `username` field from the frontend type
  return await MongoConnection.outfitsCollection()
    .find({ username: userId })
    .toArray();
};

// Get only the latest outfit for a user (by created_at)
export const getLatestOutfitByUserId = async (userId: string) => {
  return await MongoConnection.outfitsCollection()
    .find({ username: userId })
    .sort({ created_at: -1 })
    .limit(1)
    .toArray();
};

export const deleteOutfitsByUsername = async (username: string) => {
  return await MongoConnection.outfitsCollection().deleteMany({ username });
};

export const deleteOutfitById = async (id: string) => {
  return await MongoConnection.outfitsCollection().deleteOne({ _id: id });
};

export const findOutfitById = async (id: string) => {
  return await MongoConnection.outfitsCollection().findOne({ _id: id });
};

export const updateOutfit = async (
  id: string,
  updates: {
    top_id?: string;
    bottom_id?: string;
  }
) => {
  return await MongoConnection.outfitsCollection().updateOne(
    { _id: id },
    { $set: updates }
  );
};

export const rateOutfit = async (id: string, rating: Rating) => {
  return await MongoConnection.outfitsCollection().updateOne(
    { _id: id },
    { $push: { ratings: rating } }
  );
};

export const updateUserById = async (id: string, updateData: any) => {
  return await MongoConnection.userCollection().findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { returnDocument: 'after' }
  );
};
