import { FastifyInstance, FastifyPluginOptions } from 'fastify';
  import * as controllers from './controllers';

function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.route({
    method: 'POST',
    url: '/sign_up',
    handler: controllers.signUp,
  });

  server.route({
    method: 'POST',
    url: '/refresh_token',
    handler: controllers.refreshToken,
  });

  server.route({
    method: 'POST',
    url: '/login',
    handler: controllers.login,
  });

  server.route({
    method: 'GET',
    url: '/products',
    preHandler: [server.authenticate], // Valfritt, den gör att endpointen blir skyddad, d.v.s kräver token för att anropas.
    handler: controllers.getProducts,
  });

  server.route({
    method: 'POST',
    url: '/admin/products/:productId',
    preHandler: [server.adminAuthenticate],
    handler: controllers.updateProduct,
  });

  // Outfit routes

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

  // User routes
  server.route({
    method: 'GET',
    url: '/user/me',
    preHandler: [server.authenticate],
    handler: controllers.getCurrentUser,
  });

  server.route({
    method: 'POST',
    url: '/user/update',
    preHandler: [server.authenticate],
    handler: controllers.updateUser,
  });
}

export default routes;
