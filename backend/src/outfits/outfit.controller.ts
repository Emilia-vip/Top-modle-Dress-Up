import { FastifyRequest, FastifyReply } from "fastify";
import * as outfitService from "./outfit.service";
import { CreateOutfitDto, Rating } from "./types"; 

export const createOutfit = async (
  req: FastifyRequest<{ Body: CreateOutfitDto }>,
  reply: FastifyReply
) => {
  try {
    const outfit = await outfitService.createOutfit(req.body);
    return reply.code(201).send(outfit);
  } catch (error: any) {
    const message = error?.message ?? "Could not create outfit";
    return reply.code(400).send({ message });
  }
};

export const getOutfits = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const outfits = await outfitService.getOutfits();
    return reply.code(200).send(outfits);
  } catch (error: any) {
    return reply.code(500).send({ message: error?.message ?? "Server error" });
  }
};

export const getOutfitsByUserId = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const outfits = await outfitService.getOutfitsByUserId(userId);
    return reply.code(200).send(outfits);
  } catch (error: any) {
    return reply.code(500).send({ message: error?.message ?? "Server error" });
  }
};

export const updateOutfit = async (
  req: FastifyRequest<{ Params: { outfitId: string }; Body: { top_id?: string; bottom_id?: string } }>,
  reply: FastifyReply
) => {
  try {
    const { outfitId } = req.params;
    const updates = req.body;
    const result = await outfitService.updateOutfit(outfitId, updates);

   
    const modified =
      typeof result === "number" ? result : (result?.modifiedCount ?? result?.matchedCount ?? 0);

    if (modified === 0) {
      return reply.code(404).send({ message: "Outfit not found or not modified" });
    }
    return reply.code(200).send({ message: "Outfit updated" });
  } catch (error: any) {
    return reply.code(500).send({ message: error?.message ?? "Server error" });
  }
};

export const rateOutfit = async (
  req: FastifyRequest<{ Params: { outfitId: string }; Body: Rating }>,
  reply: FastifyReply
) => {
  try {
    const { outfitId } = req.params;
    const rating = req.body;
    const result = await outfitService.rateOutfit(outfitId, rating);

    const modified =
      typeof result === "number" ? result : (result?.modifiedCount ?? result?.matchedCount ?? 0);

    if (modified === 0) {
      return reply.code(404).send({ message: "Outfit not found" });
    }
    return reply.code(200).send({ message: "Rating added" });
  } catch (error: any) {
    return reply.code(500).send({ message: error?.message ?? "Server error" });
  }
};

export const deleteOutfit = async (
  req: FastifyRequest<{ Params: { outfitId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { outfitId } = req.params;
    const deleted = await outfitService.deleteOutfit(outfitId);
    if (deleted === 0) {
      return reply.code(404).send({ message: 'Outfit not found' });
    }
    return reply.code(200).send({ message: 'Outfit deleted' });
  } catch (error: any) {
    return reply.code(500).send({ message: error?.message ?? "Server error" });
  }
};