import expressListRoutes from "express-list-routes";
import app from "./app";
import { runMongoDbConnection } from "./configs/mongodb.configs";

const port = process.env.PORT || 3000;

runMongoDbConnection().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  expressListRoutes(app);
});
