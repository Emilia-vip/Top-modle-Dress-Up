import crypto from "crypto";
import * as repository from "./outfit.repository";
import * as ratingRepository from "../ratings/rating.repository";
import { CreateOutfitDto, OutfitDatabaseModel } from "./types";

export const createOutfit = async (body: CreateOutfitDto) => {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const { username, top_id, bottom_id, skin } = body as CreateOutfitDto;

  if (!username || typeof username !== "string" || username.trim() === "") {
    throw new Error("Invalid or missing 'username'");
  }
  if (!top_id || typeof top_id !== "string" || top_id.trim() === "") {
    throw new Error("Invalid or missing 'top_id'");
  }
  if (!bottom_id || typeof bottom_id !== "string" || bottom_id.trim() === "") {
    throw new Error("Invalid or missing 'bottom_id'");
  }

  const outfitSkin: "dark" | "light" =
    skin === "light" || skin === "dark" ? skin : "dark";

  const outfit: OutfitDatabaseModel = {
    _id: crypto.randomUUID(),
    username: username.trim(),
    top_id: top_id.trim(),
    bottom_id: bottom_id.trim(),
    skin: outfitSkin,
    created_at: new Date().toISOString(),
  };

  await repository.deleteOutfitsByUsername(username);
  const res = await repository.insertOutfit(outfit);

  return { ...outfit, _id: (res as any).insertedId ?? outfit._id };
};

export const getOutfits = async () => {
  return repository.getAllOutfits();
};

export const getOutfitsByUserId = async (userId: string) => {
  if (!userId || typeof userId !== "string") throw new Error("userId is required");
  return repository.getOutfitsByUserId(userId);
};

export const updateOutfit = async (
  outfitId: string,
  updates: { top_id?: string; bottom_id?: string }
) => {
  if (!outfitId || typeof outfitId !== "string" || outfitId.trim() === "") {
    throw new Error("Outfit ID is required");
  }
  if (!updates || typeof updates !== "object") {
    throw new Error("Updates are required");
  }
  return repository.updateOutfit(outfitId, updates);
};

export const deleteOutfit = async (outfitId: string) => {
  if (!outfitId || typeof outfitId !== "string" || outfitId.trim() === "") {
    throw new Error("Outfit ID is required");
  }

  const trimmedOutfitId = outfitId.trim();
  const deletedCount = await repository.deleteOutfitById(trimmedOutfitId);

  if (deletedCount > 0) {
    await ratingRepository.deleteRatingsByOutfitId(trimmedOutfitId);
  }

  return deletedCount;
};