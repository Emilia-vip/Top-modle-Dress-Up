import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'path';
import MongoConnection from './db';
import auth from './auth';
import routes from './route';

const server: FastifyInstance = fastify({ logger: true });

const port = Number(process.env.PORT) || 3000;

async function start() {
  const mongoClient = await MongoConnection.getDbClient();

  server.addHook('onClose', async () => {
    await mongoClient.close();
  });

  await server.register(cors, {
    origin: '*'
  });

  await server.register(auth);

  // Register application routes under an optional base URL prefix.
  // For example, set API_PREFIX="/api" to serve routes like "/api/login".
  await server.register(routes);

  // Serve frontend static files (Vite dist folder)
  await server.register(fastifyStatic, {
    root: path.join(__dirname, '../dist'),
    prefix: '/',
  });

  // Catch-all for SPA - send index.html for all unknown routes
  server.setNotFoundHandler((request, reply) => {
    reply.sendFile('index.html');
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
