import MongoConnection from "../db";
import { RatingDatabaseModel } from "./types";

export const insertRating = async (rating: RatingDatabaseModel) => {
  const col = await MongoConnection.ratingsCollection();
  return await col.insertOne(rating);
};

export const getAllRatings = async () => {
  const col = await MongoConnection.ratingsCollection();
  return await col.find({}).toArray();
};

export const getRatingById = async (ratingId: string) => {
  const col = await MongoConnection.ratingsCollection();
  return await col.findOne({ _id: ratingId });
};

export const getRatingsByOutfitId = async (outfitId: string) => {
  const col = await MongoConnection.ratingsCollection();
  return await col.find({ outfitId }).toArray();
};

export const updateRatingById = async (
  ratingId: string,
  updates: { grade?: number; username?: string }
) => {
  const col = await MongoConnection.ratingsCollection();
  return await col.findOneAndUpdate(
    { _id: ratingId },
    { $set: updates },
    { returnDocument: 'after' }
  );
};

export const deleteRatingById = async (ratingId: string) => {
  const col = await MongoConnection.ratingsCollection();
  const res = await col.deleteOne({ _id: ratingId });
  return res.deletedCount ?? 0;
};

export const deleteRatingsByOutfitId = async (outfitId: string) => {
  const col = await MongoConnection.ratingsCollection();
  const res = await col.deleteMany({ outfitId });
  return res.deletedCount ?? 0;
};