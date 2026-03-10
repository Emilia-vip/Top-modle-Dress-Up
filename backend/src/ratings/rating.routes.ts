import { FastifyInstance } from 'fastify';
import * as controllers from "./rating.controller";

export default async function routes(
  server: FastifyInstance
) {
  server.route({
    method: 'GET',
    url: '/ratings',
    handler: controllers.getRatings,
  });

  server.route({
    method: 'GET',
    url: '/ratings/:ratingId',
    handler: controllers.getRatingById,
  });

  server.route({
    method: 'POST',
    url: '/outfits/:outfitId/rate',
    preHandler: [server.authenticateEither],
    handler: controllers.rateOutfit,
  });

  server.route({
    method: 'PUT',
    url: '/ratings/:ratingId',
    handler: controllers.updateRating,
  });

  server.route({
    method: 'DELETE',
    url: '/ratings/:ratingId',
    handler: controllers.deleteRating,
  });
}