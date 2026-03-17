import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendError } from "../http/errors";

declare module "fastify" {
  interface FastifyRequest {
    auth0Id?: string;
    email?: string;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    sendError(reply, 401, "No token", "UNAUTHORIZED");
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    sendError(reply, 401, "Invalid token", "UNAUTHORIZED");
    return;
  }

  try {
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || typeof decoded.sub !== "string") {
      sendError(reply, 401, "Invalid token", "UNAUTHORIZED");
      return;
    }

    request.auth0Id = decoded.sub;
    request.email = typeof decoded.email === "string" ? decoded.email : undefined;
  } catch {
    sendError(reply, 401, "Invalid token", "UNAUTHORIZED");
  }
}

export default authMiddleware;

