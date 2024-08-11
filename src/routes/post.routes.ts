import express from "express";
import {
  createPostHandler,
  deletedPostHandler,
  getActivePostsHandler,
  getPostHandler,
  getUserPostHandler,
  updatePostHandler,
} from "../controllers/post.controllers";

const router = express.Router();

router.get("/explore/:id", getActivePostsHandler);
router.get("/:id", getPostHandler);
router.get("/user/:id", getUserPostHandler);
router.post("/", createPostHandler);
router.delete("/:id", deletedPostHandler);
router.put("/:id", updatePostHandler);

export { router as PostRoutes };
