import express from "express";
import {
  createPostHandler,
  deletedPostHandler,
  getActivePostsHandler,
  getExploreItemsPostHandler,
  getPostHandler,
  getUserPostHandler,
  updatePostHandler,
  getPostsPaginated,
  addSuggestionToPost,
  getSuggestions
} from "../controllers/post.controllers";

const router = express.Router();

router.get("/explore/:id", getActivePostsHandler);
router.get("/pagin", getPostsPaginated);
router.get("/:id", getPostHandler);
router.get("/user/:id", getUserPostHandler);
router.get("/", getActivePostsHandler);
router.post("/", createPostHandler);
router.delete("/:id", deletedPostHandler);
router.put("/:id", updatePostHandler);
router.get("/explore/:userId", getExploreItemsPostHandler);

router.get("/suggestion/:id", getSuggestions);
router.post("/suggestion/:id", addSuggestionToPost);

export { router as PostRoutes };
