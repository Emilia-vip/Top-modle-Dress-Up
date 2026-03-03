import { FastifyInstance } from "fastify";
import User from "../models/user";
import authMiddleware from "../middleware/auth";

export default async function syncUserRoutes(fastify: FastifyInstance) {
  fastify.post("/api/sync-user", { preHandler: authMiddleware }, async (request, reply) => {
    // @ts-ignore – beroende på hur authMiddleware lägger till auth0Id/email
    const { auth0Id, email } = request;

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
      reply.status(500).send({ error: "Server error" });
    }
  });
}