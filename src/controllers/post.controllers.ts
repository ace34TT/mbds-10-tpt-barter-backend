import {
  createPostService,
  deletePostService,
  getActivePostService,
  updatePostService,
  getPostService
} from "../services/post.services";
import { Request, Response } from "express";

export const getActivePostsHandler = async (req: Request, res: Response) => {
  try {
    const posts = await getActivePostService();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getPostsPaginated = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getPostService(page, limit);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};


export const createPostHandler = async (req: Request, res: Response) => {
  try {
    const post = req.body;
    const _post = await createPostService(post);
    return res.status(201).json(_post);
  } catch (error:any) {
    console.log(error.message);
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
  } catch (error :any) {
    return res.status(500).json({ message: error.message });
  }
};
