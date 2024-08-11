import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { AuthRoutes } from "./routes/auth.routes";
import { CategoryRoutes } from "./routes/category.routes";
import { ChatRoutes } from "./routes/chat.routes";
import { NotificationRoutes } from "./routes/notiification.routes";
import { ObjectRoutes } from "./routes/object.routes";
import { UserRoutes } from "./routes/user.routes";
import { ReportRoutes } from "./routes/report.routes";
import Protect from "./middlewares/auth";
import { errorHandler } from "./middlewares/error.middleware";
import cors from "cors";
import { PostRoutes } from "./routes/post.routes";
import { SuggestionRoutes } from "./routes/suggestion.routes";

const app = express();
app.use(cors({}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// !
app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/categories", Protect, CategoryRoutes);
app.use("/api/chats", ChatRoutes);
app.use("/api/notifications", Protect, NotificationRoutes);
app.use("/api/objects", Protect, ObjectRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/reports", Protect, ReportRoutes);
app.use("/api/users", Protect, UserRoutes);
app.use("/api/suggestions", SuggestionRoutes);

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!errorHandler.isTrustedError(err)) {
    return next(err); // Immediately pass untrusted errors to the next handler
  }
  await errorHandler.handleError(err, req, res, next); // Handle trusted errors
});

export default app;
