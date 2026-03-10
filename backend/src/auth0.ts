import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { sendError } from './http/errors';
import { TokenPayload } from './types';

type Auth0TokenPayload = JwtPayload & {
  sub: string;
  email?: string;
};

const ROLE_ADMIN = 'admin';

const getAuth0Roles = (payload: Auth0TokenPayload): string[] => {
  const namespacedRoles = payload['https://topmodelrunway/roles'];
  if (Array.isArray(namespacedRoles)) {
    return namespacedRoles.filter((item): item is string => typeof item === 'string');
  }

  const directRoles = (payload as JwtPayload & { roles?: unknown }).roles;
  if (Array.isArray(directRoles)) {
    return directRoles.filter((item): item is string => typeof item === 'string');
  }

  const realmRoles = (payload as JwtPayload & { realm_access?: { roles?: unknown } }).realm_access?.roles;
  if (Array.isArray(realmRoles)) {
    return realmRoles.filter((item): item is string => typeof item === 'string');
  }

  return [];
};

const auth0Domain = process.env.AUTH0_DOMAIN;

if (!auth0Domain) {
  throw new Error('Set AUTH0_DOMAIN!');
}

const auth0Audience = process.env.AUTH0_AUDIENCE;

const client = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  if (!header.kid) {
    callback(new Error('Missing kid in token header'));
    return;
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }

    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

async function verifyAuth0BearerToken(request: FastifyRequest): Promise<Auth0TokenPayload> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing bearer token');
  }

  const token = authHeader.slice(7);

  return new Promise<Auth0TokenPayload>((resolve, reject) => {
    const verifyOptions: jwt.VerifyOptions = {
      algorithms: ['RS256'],
      issuer: `https://${auth0Domain}/`,
    };

    if (auth0Audience) {
      verifyOptions.audience = auth0Audience;
    }

    jwt.verify(token, getKey, verifyOptions, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }

      const payload = decoded as Auth0TokenPayload;
      if (!payload?.sub) {
        reject(new Error('Invalid Auth0 token payload'));
        return;
      }

      resolve(payload);
    });
  });
}

declare module 'fastify' {
  interface FastifyRequest {
    auth0User?: Auth0TokenPayload;
  }

  interface FastifyInstance {
    authenticateAuth0(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    authenticateEither(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    adminAuthenticateEither(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

async function auth0(server: FastifyInstance): Promise<void> {
  server.decorate(
    'authenticateAuth0',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const decoded = await verifyAuth0BearerToken(request);
        request.auth0User = decoded;
      } catch {
        return sendError(reply, 401, 'Not authorized', 'UNAUTHORIZED');
      }
    }
  );

  // Accept either legacy local JWTs or Auth0 JWTs during migration.
  server.decorate(
    'authenticateEither',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const decodedToken = await request.jwtVerify<TokenPayload>();
        if (decodedToken.type === 'access') {
          return;
        }
      } catch {
        // Fallback to Auth0 JWT validation.
      }

      try {
        const decoded = await verifyAuth0BearerToken(request);
        request.auth0User = decoded;
      } catch {
        return sendError(reply, 401, 'Not authorized', 'UNAUTHORIZED');
      }
    }
  );

  server.decorate(
    'adminAuthenticateEither',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const decodedToken = await request.jwtVerify<TokenPayload>();
        if (decodedToken.type === 'access' && decodedToken.role === ROLE_ADMIN) {
          return;
        }
      } catch {
        // Fallback to Auth0 JWT validation.
      }

      try {
        const decoded = await verifyAuth0BearerToken(request);
        request.auth0User = decoded;
        const roles = getAuth0Roles(decoded);
        if (roles.includes(ROLE_ADMIN)) {
          return;
        }
      } catch {
        return sendError(reply, 401, 'Not authorized', 'UNAUTHORIZED');
      }

      return sendError(reply, 403, 'Forbidden', 'FORBIDDEN');
    }
  );
}

export default fastifyPlugin(auth0);