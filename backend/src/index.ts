import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import MongoConnection from './database/db';
import auth from './plugins/auth';
import auth0 from './plugins/auth0';
import routes from './routes/route';
import syncUserRoutes from './routes/syncUser';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { AppError, sendError } from './http/errors';



const server: FastifyInstance = fastify({ logger: true });

const port = Number(process.env.PORT) || 3002;

async function start() {
  const mongoClient = await MongoConnection.getDbClient();

  server.addHook('onClose', async () => {
    await mongoClient.close();
  });


  await server.register(fastifyHelmet, { contentSecurityPolicy: false });


  await server.register(cors, {
    origin: '*'
  });

  await server.register(auth);
  await server.register(auth0);

  await server.register(routes);

  await server.register(syncUserRoutes);

  await server.register(fastifyRateLimit, {
    max: 100,                // max antal requests
    timeWindow: '1 minute',  // per tidsfönster
    allowList: ['127.0.0.1'], // ev. lägg till egna IP:n du vill undanta
    keyGenerator: (req) => req.ip, // rate limit per IP
  });

  server.setNotFoundHandler(async (request, reply) => {
    return sendError(
      reply,
      404,
      `Route ${request.method} ${request.url} not found`,
      'NOT_FOUND'
    );
  });

  server.setErrorHandler((error, _request, reply) => {
    if (reply.sent) {
      return;
    }

    const validationError = error as { validation?: unknown };

    if (validationError.validation) {
      return sendError(reply, 400, 'Validation failed', 'VALIDATION_ERROR', {
        validation: validationError.validation,
      });
    }

    if (error instanceof AppError) {
      return sendError(reply, error.statusCode, error.message, error.code, error.details);
    }

    server.log.error(error);
    return sendError(reply, 500, 'Internal server error', 'INTERNAL_ERROR');
  });

  server.listen({ host: '0.0.0.0', port }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server is running on ${address}`);
  });
}

start();
