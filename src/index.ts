import expressListRoutes from "express-list-routes";
import app from "./app";
import { runMongoDbConnection } from "./configs/mongodb.configs";
import { runPrisma } from "./configs/prisma.configs";
import * as http from "node:http";
import { socketManager } from "./configs/socket.configs";

const port = process.env.PORT || 3000;
const server = http.createServer(app);

async function startServer() {
  try {
    await runMongoDbConnection();
    await runPrisma();
    socketManager.initSocket(server);

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      expressListRoutes(app);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();

