import {
  createPostService,
  deletePostService,
  getActivePostService,
  getExploreItemPostService,
  getUserPostService,
  updatePostService,
  getPostService,
  getAllPostService,
  addSuggestionToPostService,
  getPostSuggestions
} from "../services/post.services";
import { Request, Response } from "express";

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
    console.log(req.params.id);
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


export const getPostsPaginated = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllPostService(page, limit);
    
    return res.status(200).json(result);
  } catch (error:any) {
    console.log(error.message);
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

export const addSuggestionToPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const objectIds = req.body.objects;
    const suggestedById = req.body.suggestedById;
    // Créez la suggestion
    const addSuggest = await addSuggestionToPostService (postId,objectIds,suggestedById);
    return res.status(200).json(addSuggest);
  } catch (error:any) {
    console.error('Error adding suggestion to post:', error.message);
    throw error;
  }
};

export const  getSuggestions = async (req: Request, res: Response) =>  {
  const postId = parseInt(req.params.id, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const suggestions = await getPostSuggestions(postId);
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}
