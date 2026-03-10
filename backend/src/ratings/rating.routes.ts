import { FastifyInstance } from 'fastify';
import * as controllers from "./rating.controller";

export default async function routes(
  server: FastifyInstance
) {
  server.route({
    method: 'POST',
    url: '/outfits/:outfitId/rate',
    handler: controllers.rateOutfit,
  });
}