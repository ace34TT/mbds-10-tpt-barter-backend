import { Request, Response } from "express";
import {
  createPostService,
  deletePostService,
  getActivePostService,
  updatePostService,
} from "../services/post.services";

export const getActivePostsHandler = async (req: Request, res: Response) => {
  try {
    const posts = await getActivePostService();
    return res.status(200).json(posts);
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
