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
import { DashboardRoutes } from "./routes/dashboard.routes";
import { RoleRoutes } from "./routes/role.routes";

const app = express();

const corsOptions = {
  origin:['https://localhost:4200'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));app.use(bodyParser.urlencoded({ extended: false }));

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


// !
app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/categories", Protect, CategoryRoutes);
app.use("/api/chats", Protect,ChatRoutes);
app.use("/api/notifications", Protect, NotificationRoutes);
app.use("/api/objects", Protect, ObjectRoutes);
app.use("/api/posts",Protect, PostRoutes);
app.use("/api/reports", Protect, ReportRoutes);
app.use("/api/users", Protect, UserRoutes);
app.use("/api/suggestions", SuggestionRoutes);
app.use("/api/dashboard",Protect, DashboardRoutes);
app.use("/api/roles", Protect, RoleRoutes);

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!errorHandler.isTrustedError(err)) {
    return next(err); // Immediately pass untrusted errors to the next handler
  }
  await errorHandler.handleError(err, req, res, next); // Handle trusted errors
});

export default app;
