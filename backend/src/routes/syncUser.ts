import { FastifyInstance } from "fastify";
import User from "../models/user";
import authMiddleware from "../middleware/auth"; // now works because auth.ts exports default
import { sendError } from "../http/errors";

export default async function syncUserRoutes(fastify: FastifyInstance) {
  fastify.post("/api/sync-user", { preHandler: authMiddleware }, async (request, reply) => {

    const { auth0Id, email } = request;

    if (!auth0Id || !email) {
      return sendError(reply, 401, "Invalid token payload", "UNAUTHORIZED");
    }

    try {
      let user = await User.findOne({ auth0_id: auth0Id });

      if (!user) {
        user = await User.create({
          auth0_id: auth0Id,
          email: email,
          username: email.split("@")[0], // default username
        });
      }

      reply.send(user);
    } catch (err) {
      console.error(err);
      return sendError(reply, 500, "Server error", "INTERNAL_ERROR");
    }
  });
}