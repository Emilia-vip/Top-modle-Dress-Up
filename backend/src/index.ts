import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import MongoConnection from './db';
import auth from './auth';
import routes from './routes/route';
import syncUserRoutes from './routes/syncUser';

const server: FastifyInstance = fastify({ logger: true });

const port = 3002;

async function start() {
  const mongoClient = await MongoConnection.getDbClient();

  server.addHook('onClose', async () => {
    await mongoClient.close();
  });

  await server.register(cors, {
    origin: '*'
  });

  await server.register(auth);

 
  await server.register(routes);

  await server.register(syncUserRoutes);

  server.listen({ host: '0.0.0.0', port }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server is running on ${address}`);
  });
}

start();
