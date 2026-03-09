import { FastifyInstance } from 'fastify';
import * as controllers from "./outfit.controller";

// Registrera outfit-routes som ett Fastify-plugin
export default async function routes(
  server: FastifyInstance
) {
  server.route({
    method: 'POST',
    url: '/outfits',
    handler: controllers.createOutfit,
  });

  server.route({
    method: 'GET',
    url: '/outfits',
    handler: controllers.getOutfits,
  });

  server.route({
    method: 'GET',
    url: '/outfits/user/:userId',
    handler: controllers.getOutfitsByUserId,
  });

  server.route({
    method: 'PUT',
    url: '/outfits/:outfitId',
    handler: controllers.updateOutfit,
  });

  server.route({
    method: 'POST',
    url: '/outfits/:outfitId/rate',
    handler: controllers.rateOutfit,
  });

  server.route({
    method: 'DELETE',
    url: '/outfits/:outfitId',
    handler: controllers.deleteOutfit,
  });
}
