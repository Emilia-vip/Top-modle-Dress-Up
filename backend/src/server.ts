import fastify from "fastify";
import { connectDB } from "./db"; 
import syncUserRoutes from "./routes/syncUser";

const app = fastify();

// kopppla MongoDB
connectDB();

// routes till register
app.register(syncUserRoutes);

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});
