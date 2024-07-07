import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { AuthRoutes } from "./routes/auth.routes";
import { CategoryRoutes } from "./routes/category.routes";
import { ChatRoutes } from "./routes/chat.routes";
import { NotificationRoutes } from "./routes/notiification.routes";
import { ObjectRoutes } from "./routes/object.routes";
import { UserRoutes } from "./routes/user.routes";
import { ReportRoutes } from "./routes/report.routes";
import { PostRoutes } from "./routes/post.routes";

const app = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(bodyParser.json());

// !
app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/chats", ChatRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/notifications", NotificationRoutes);
app.use("/api/objects", ObjectRoutes);
app.use("/api/reports", ReportRoutes);
app.use("/api/users", UserRoutes);

export default app;
