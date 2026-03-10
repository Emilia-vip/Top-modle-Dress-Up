import crypto from "crypto";
import * as ratingRepository from "./rating.repository";
import * as outfitRepository from "../outfits/outfit.repository";
import { CreateRatingDto, RatingDatabaseModel } from "./types";

export const rateOutfit = async (outfitId: string, rating: CreateRatingDto) => {
  if (!outfitId || typeof outfitId !== "string" || outfitId.trim() === "") {
    throw new Error("Outfit ID is required");
  }

  if (!rating || typeof rating !== "object") {
    throw new Error("Rating is required");
  }

  const { grade, username } = rating;

  if (typeof grade !== "number") {
    throw new Error("Grade is required");
  }

  if (!username || typeof username !== "string" || username.trim() === "") {
    throw new Error("Username is required");
  }

  const trimmedOutfitId = outfitId.trim();

  const outfit = await outfitRepository.findOutfitById(trimmedOutfitId);
  if (!outfit) {
    throw new Error("Outfit not found");
  }

  const ratingToSave: RatingDatabaseModel = {
    _id: crypto.randomUUID(),
    outfitId: trimmedOutfitId,
    grade,
    username: username.trim(),
    created_at: new Date().toISOString(),
  };

  return await ratingRepository.insertRating(ratingToSave);
};