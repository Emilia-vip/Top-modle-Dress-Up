import crypto from "crypto";
import * as repository from "./outfit.repository";
import { CreateOutfitDto, OutfitDatabaseModel, Rating } from "./types";

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
    ratings: [],
    created_at: new Date().toISOString(),
  };

  // Radera gamla outfit(s) för användaren innan ny sparas
  await repository.deleteOutfitsByUsername(username);
  const res = await repository.insertOutfit(outfit);

  // Om vi vill försäkra att returnerat objekt innehåller databasen-id:
  return { ...outfit, _id: (res as any).insertedId ?? outfit._id };
};

export const getOutfits = async () => {
  return repository.getAllOutfits();
};

/**
 * Hämta outfits för en användare
 */
export const getOutfitsByUserId = async (userId: string) => {
  if (!userId || typeof userId !== "string") throw new Error("userId is required");
  return repository.getOutfitsByUserId(userId);
};

/**
 * Uppdatera outfit (top/bottom)
 * Returnerar repositoryns resultat (UpdateResult) — controller tolkar modifiedCount/matchedCount.
 */
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

/**
 * Lägg till en rating på en outfit
 * Returnerar repositoryns resultat (UpdateResult).
 */
export const rateOutfit = async (outfitId: string, rating: Rating) => {
  if (!outfitId || typeof outfitId !== "string" || outfitId.trim() === "") {
    throw new Error("Outfit ID is required");
  }
  if (!rating || typeof rating !== "object") {
    throw new Error("Rating is required");
  }
  return repository.rateOutfit(outfitId, rating);
};

/**
 * Delete an outfit by id.
 * Returns the number of deleted documents (0 if not found).
 */
export const deleteOutfit = async (outfitId: string) => {
  if (!outfitId || typeof outfitId !== "string" || outfitId.trim() === "") {
    throw new Error("Outfit ID is required");
  }

  const deletedCount = await repository.deleteOutfitById(outfitId);
  return deletedCount; // number: 0 means not found, >0 means deleted
};