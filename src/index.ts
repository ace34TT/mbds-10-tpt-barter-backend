import expressListRoutes from "express-list-routes";
import app from "./app";
import { runMongoDbConnection } from "./configs/mongodb.configs";
import { runPrisma } from "./configs/prisma.configs";

const port = process.env.PORT || 3000;

runMongoDbConnection().catch(console.dir);
runPrisma();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  expressListRoutes(app);
});
