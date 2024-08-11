import { Request, Response } from "express";
import {
  createPostService,
  deletePostService,
  getActivePostService,
  getExploreItemPostService,
  getPostService,
  getUserPostService,
  updatePostService,
} from "../services/post.services";

export const getActivePostsHandler = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if(page == 0) {
      page = 1;
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const posts = await getActivePostService(page, limit, userId);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostHandler = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await getPostService(postId);
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createPostHandler = async (req: Request, res: Response) => {
  try {
    const post = req.body;
    const _post = await createPostService(post);
    return res.status(201).json(_post);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletedPostHandler = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const deletedPost = await deletePostService(postId);
    return res.status(200).json(deletedPost);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePostHandler = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const updatedFields = req.body;
    const updatedPost = await updatePostService(postId, updatedFields);
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getExploreItemsPostHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log("fetching data ", userId);
    const feedPosts = await getExploreItemPostService(userId);
    return res.status(200).json(feedPosts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getUserPostHandler = async (req: Request, res: Response) => {
  try {
    let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if(page == 0) {
      page = 1;
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const authorId = parseInt(req.params.id);
    const post = await getUserPostService(authorId, page, limit);
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
