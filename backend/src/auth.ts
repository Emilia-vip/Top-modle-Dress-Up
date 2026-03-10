import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { sendError } from './http/errors';

export interface TokenPayload {
  user_id: string;
  email: string;
  phone: string;
  display_name: string;
  role: string;
  type: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    adminAuthenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;
  }
}

const secretKey = process.env.JWT_SECRET_KEY;

if (secretKey === undefined) throw new Error('Set JWT_SECRET_KEY!');
const jwtSecret: string = secretKey;
const ROLE_ADMIN = 'admin';

async function auth(server: FastifyInstance): Promise<void> {
  await server.register(fastifyJwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: 10000,
    },
  });

  server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const decodedToken = await request.jwtVerify<TokenPayload>();

        if (decodedToken.type !== 'access') {
          return sendError(reply, 401, 'Not authorized', 'UNAUTHORIZED');
        }
      } catch {
        return sendError(reply, 401, 'Not authorized', 'UNAUTHORIZED');
      }
    }
  );

  server.decorate(
    'adminAuthenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const decodedToken = await request.jwtVerify<TokenPayload>();

        if (decodedToken.role !== ROLE_ADMIN || decodedToken.type !== 'access') {
          return sendError(reply, 401, 'Not authorized', 'UNAUTHORIZED');
        }
      } catch {
        return sendError(reply, 401, 'Not authorized', 'UNAUTHORIZED');
      }
    }
  );
}

export default fastifyPlugin(auth);
