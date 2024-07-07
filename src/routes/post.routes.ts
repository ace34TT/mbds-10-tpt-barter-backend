import express from "express";
import {
  createPostHandler,
  deletedPostHandler,
  getActivePostsHandler,
  updatePostHandler,
} from "../controllers/post.controllers";

const router = express.Router();

router.get("/", getActivePostsHandler);
router.post("/", createPostHandler);
router.delete("/:id", deletedPostHandler);
router.put("/:id", updatePostHandler);

export { router as PostRoutes };
