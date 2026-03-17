import MongoConnection from '../database/db';
import { OutfitDatabaseModel } from './types';

// --- Outfits ---

export const insertOutfit = async (outfit: OutfitDatabaseModel) => {
  const col = await MongoConnection.outfitsCollection();
  return await col.insertOne(outfit);
};

export const getAllOutfits = async () => {
  const col = await MongoConnection.outfitsCollection();
  return await col.find({}).toArray();
};

export const getOutfitsByUserId = async (userId: string) => {
  const col = await MongoConnection.outfitsCollection();
  return await col.find({ username: userId }).toArray();
};

export const getLatestOutfitByUserId = async (userId: string) => {
  const col = await MongoConnection.outfitsCollection();
  const arr = await col
    .find({ username: userId })
    .sort({ created_at: -1 })
    .limit(1)
    .toArray();
  return arr[0] ?? null;
};

export const updateOutfit = async (
  id: string,
  updates: { top_id?: string; bottom_id?: string }
) => {
  const col = await MongoConnection.outfitsCollection();
  return await col.updateOne({ _id: id }, { $set: updates });
};

export const deleteOutfitById = async (id: string) => {
  const col = await MongoConnection.outfitsCollection();
  const res = await col.deleteOne({ _id: id });
  return res.deletedCount ?? 0;
};

export const deleteOutfitsByUsername = async (username: string) => {
  const col = await MongoConnection.outfitsCollection();
  const res = await col.deleteMany({ username });
  return res.deletedCount ?? 0;
};

export const findOutfitById = async (id: string) => {
  const col = await MongoConnection.outfitsCollection();
  return await col.findOne({ _id: id });
};