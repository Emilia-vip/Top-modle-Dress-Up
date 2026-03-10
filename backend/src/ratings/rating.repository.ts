import MongoConnection from "../db";
import { RatingDatabaseModel } from "./types";

export const insertRating = async (rating: RatingDatabaseModel) => {
  const col = await MongoConnection.ratingsCollection();
  return await col.insertOne(rating);
};

export const getRatingsByOutfitId = async (outfitId: string) => {
  const col = await MongoConnection.ratingsCollection();
  return await col.find({ outfitId }).toArray();
};

export const deleteRatingsByOutfitId = async (outfitId: string) => {
  const col = await MongoConnection.ratingsCollection();
  const res = await col.deleteMany({ outfitId });
  return res.deletedCount ?? 0;
};