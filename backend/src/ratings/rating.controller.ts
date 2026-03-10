import { FastifyRequest, FastifyReply } from "fastify";
import * as ratingService from "./rating.service";
import { CreateRatingDto } from "./types";
import { sendError } from "../http/errors";

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return sendError(reply, 500, message, "INTERNAL_ERROR");
  }
};

export const getRatings = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const ratings = await ratingService.getRatings();
    return reply.code(200).send(ratings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return sendError(reply, 500, message, "INTERNAL_ERROR");
  }
};

export const getRatingById = async (
  req: FastifyRequest<{ Params: { ratingId: string } }>,
  reply: FastifyReply
) => {
  try {
    const rating = await ratingService.getRatingById(req.params.ratingId);

    if (!rating) {
      return sendError(reply, 404, "Rating not found", "NOT_FOUND");
    }

    return reply.code(200).send(rating);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return sendError(reply, 400, message, "BAD_REQUEST");
  }
};

export const updateRating = async (
  req: FastifyRequest<{ Params: { ratingId: string }; Body: { grade?: number; username?: string } }>,
  reply: FastifyReply
) => {
  try {
    const updatedRating = await ratingService.updateRating(req.params.ratingId, req.body);

    if (!updatedRating) {
      return sendError(reply, 404, "Rating not found", "NOT_FOUND");
    }

    return reply.code(200).send(updatedRating);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return sendError(reply, 400, message, "BAD_REQUEST");
  }
};

export const deleteRating = async (
  req: FastifyRequest<{ Params: { ratingId: string } }>,
  reply: FastifyReply
) => {
  try {
    const deletedCount = await ratingService.deleteRating(req.params.ratingId);

    if (deletedCount === 0) {
      return sendError(reply, 404, "Rating not found", "NOT_FOUND");
    }

    return reply.code(200).send({ message: "Rating deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return sendError(reply, 400, message, "BAD_REQUEST");
  }
};