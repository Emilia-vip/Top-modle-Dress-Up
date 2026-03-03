import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";

// Utöka FastifyRequest för att inkludera auth0Id och email
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
    // OBS: decode används här för demo, använd verify med jwks-rsa i produktion
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || typeof decoded.sub !== "string") {
      reply.status(401).send({ error: "Invalid token" });
      return;
    }

    // Sätt värden på request-objektet
    request.auth0Id = decoded.sub;
    request.email = typeof decoded.email === "string" ? decoded.email : undefined;

  } catch (err) {
    reply.status(401).send({ error: "Invalid token" });
  }
}

export default authMiddleware;

