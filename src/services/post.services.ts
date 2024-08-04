import { prisma } from "../configs/prisma.configs";
import { IPost } from "../shared/interfaces/prismaModels.interfaces";

export const getActivePostService = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: { deletedAt: null },
      include: {
        objects: true,
        suggestions: true,
        author: true,
      },
    });
    return posts;
  } catch (error) {}
};

export const getPostService = async (page: number, limit: number) => {
  try {
    const posts = await prisma.post.findMany({
      skip: page * limit,
      take: limit,
      where: { deletedAt: null },
      include: {
        author: true,
        objects: {
          include: {
            object: true,
          },
        },
        suggestions: {
          include: {
            suggestedObject: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : null,
      prevPage: page > 0 ? page - 1 : null,
      hasMore: (page + 1) * limit < totalPosts,
    };
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while fetching posts.');
  }
};
export const createPostService = async (post: IPost) => {
  try {
    const _post = await prisma.post.create({
      data: {
        author: { connect: { id: post.authorId } },
        objects: {
          connect: post.objectIds.map((objectId) => ({ id: objectId })),
        },
      },
    });
    return _post;
  } catch (error:any) {
    console.log(error.message);
    throw error;
  }
};

export const updatePostService = async (
  postId: number,
  updatedFields: {
    objects?: { connect: { id: number }[] };
    suggestions?: { connect: { id: number }[] };
  }
) => {
  const post = await prisma.post.update({
    where: { id: postId },
    data: updatedFields,
    include: {
      objects: true,
      suggestions: true,
      author: true,
    },
  });

  return post;
};

export const deletePostService = async (postId: number) => {
  try {
    const deletedPost = prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });
    return deletedPost;
  } catch (error) {
    throw error;
  }
};
