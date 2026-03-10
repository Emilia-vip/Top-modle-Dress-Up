import { FastifyRequest, FastifyReply } from "fastify";
import * as ratingService from "./rating.service";
import { CreateRatingDto } from "./types";

export const rateOutfit = async (
  req: FastifyRequest<{ Params: { outfitId: string }; Body: CreateRatingDto }>,
  reply: FastifyReply
) => {
  try {
    const { outfitId } = req.params;
    const rating = req.body;

    const result = await ratingService.rateOutfit(outfitId, rating);

    return reply.code(201).send({
      message: "Rating added",
      insertedId: result.insertedId,
    });
  } catch (error: any) {
    return reply.code(500).send({
      message: error?.message ?? "Server error",
    });
  }
};