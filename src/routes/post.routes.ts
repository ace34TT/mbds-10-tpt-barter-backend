import express from "express";
import { getPostsHandler } from "../controllers/post.controllers";

const router = express.Router();

router.get("/", getPostsHandler);

export { router as PostRoutes };
