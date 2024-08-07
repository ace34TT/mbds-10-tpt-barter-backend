import express from "express";
import {
  createPostHandler,
  deletedPostHandler,
  getActivePostsHandler,
  getPostHandler,
  updatePostHandler,
} from "../controllers/post.controllers";

const router = express.Router();

router.get("/", getActivePostsHandler);
router.get("/:id", getPostHandler);
router.post("/", createPostHandler);
router.delete("/:id", deletedPostHandler);
router.put("/:id", updatePostHandler);

export { router as PostRoutes };
