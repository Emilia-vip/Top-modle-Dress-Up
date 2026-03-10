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

export const getRatings = async () => {
  return ratingRepository.getAllRatings();
};

export const getRatingById = async (ratingId: string) => {
  if (!ratingId || typeof ratingId !== "string" || ratingId.trim() === "") {
    throw new Error("Rating ID is required");
  }

  return ratingRepository.getRatingById(ratingId.trim());
};

export const updateRating = async (
  ratingId: string,
  updates: { grade?: number; username?: string }
) => {
  if (!ratingId || typeof ratingId !== "string" || ratingId.trim() === "") {
    throw new Error("Rating ID is required");
  }

  if (!updates || typeof updates !== "object") {
    throw new Error("Updates are required");
  }

  const sanitizedUpdates: { grade?: number; username?: string } = {};

  if (typeof updates.grade === "number") {
    sanitizedUpdates.grade = updates.grade;
  }

  if (typeof updates.username === "string" && updates.username.trim() !== "") {
    sanitizedUpdates.username = updates.username.trim();
  }

  if (Object.keys(sanitizedUpdates).length === 0) {
    throw new Error("At least one updatable field is required");
  }

  return ratingRepository.updateRatingById(ratingId.trim(), sanitizedUpdates);
};

export const deleteRating = async (ratingId: string) => {
  if (!ratingId || typeof ratingId !== "string" || ratingId.trim() === "") {
    throw new Error("Rating ID is required");
  }

  return ratingRepository.deleteRatingById(ratingId.trim());
};