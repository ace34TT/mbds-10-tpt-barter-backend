import express from "express";
import {
  createPostHandler,
  deletedPostHandler,
  getActivePostsHandler,
  updatePostHandler,
  getPostsPaginated
} from "../controllers/post.controllers";

const router = express.Router();

router.get("/", getActivePostsHandler);
router.get("/pagin", getPostsPaginated);
router.post("/", createPostHandler);
router.delete("/:id", deletedPostHandler);
router.put("/:id", updatePostHandler);

export { router as PostRoutes };
