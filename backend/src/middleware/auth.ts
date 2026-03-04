import { FastifyReply, FastifyRequest } from "fastify";

interface AuthRequest extends FastifyRequest {
  auth0Id?: string;
  email?: string;
}

export async function authMiddleware(
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    reply.status(401).send({ error: "No token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    
    const decoded = request.jwt.decode(token) | null;

    if (!decoded || typeof decoded.sub !== "string") {
      reply.status(401).send({ error: "Invalid token" });
      return;
    }

    request.auth0Id = decoded.sub;
    request.email = typeof decoded.email === "string" ? decoded.email : undefined;

  } catch (err: any) {
    reply.status(401).send({ error: "Invalid token" });
  }
}

export default authMiddleware;

