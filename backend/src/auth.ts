import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

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

export const ROLE_SALES_PERSON = 'sales-person';
export const ROLE_ADMIN = 'admin';

const secretKey = process.env.JWT_SECRET_KEY;

if (secretKey === undefined) throw new Error('Set JWT_SECRET_KEY!');

async function auth(
  server: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  await server.register(fastifyJwt, {
    secret: secretKey!!,
    sign: {
      expiresIn: 10000,
    },
  });

  server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const decodedToken = await request.jwtVerify<TokenPayload>();

        if (
          decodedToken.role !== ROLE_SALES_PERSON ||
          decodedToken.type !== 'access'
        ) {
          return reply.status(401).send('Not authorized');
        }
      } catch (err) {
        return reply.status(401).send('Not authorized');
      }
    }
  );

  server.decorate(
    'adminAuthenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const decodedToken = await request.jwtVerify<TokenPayload>();

        if (
          decodedToken.role !== ROLE_ADMIN ||
          decodedToken.type !== 'access'
        ) {
          return reply.status(401).send('Not authorized');
        }
      } catch (error) {
        return reply.status(401).send('Not authorized');
      }
    }
  );
}

export default fastifyPlugin(auth);
