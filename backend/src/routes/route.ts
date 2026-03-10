import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as controllers from '../controllers';
import outfitRoutes from "../outfits/outfit.routes"
import ratingRoutes from '../ratings/rating.routes';

function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  // Auth / User routes
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
    url: '/user/me',
    preHandler: [server.authenticate],
    handler: controllers.getCurrentUser,
  });

  server.route({
    method: 'GET',
    url: '/users',
    preHandler: [server.adminAuthenticateEither],
    handler: controllers.getAllUsers,
  });

  server.route({
    method: 'GET',
    url: '/users/id/:userId',
    preHandler: [server.adminAuthenticateEither],
    handler: controllers.getUserById,
  });

  server.route({
    method: 'GET',
    url: '/users/auth0/:auth0Id',
    handler: controllers.getUserByAuth0,
  });

  server.route({
    method: 'POST',
    url: '/users',
    handler: controllers.createUserFromAuth0,
  });

  server.route({
    method: 'POST',
    url: '/user/update',
    preHandler: [server.authenticate],
    handler: controllers.updateUser,
  });

  server.route({
    method: 'PUT',
    url: '/users/:userId',
    preHandler: [server.adminAuthenticateEither],
    handler: controllers.updateUserById,
  });

  server.route({
    method: 'PUT',
    url: '/users/:userId/role',
    preHandler: [server.adminAuthenticateEither],
    handler: controllers.updateUserRole,
  });

  server.route({
    method: 'DELETE',
    url: '/users/:userId',
    preHandler: [server.adminAuthenticateEither],
    handler: controllers.deleteUserById,
  });

  // Registrera outfit-routes som ett eget plugin
  server.register(outfitRoutes);
  server.register(ratingRoutes);
}

export default routes;