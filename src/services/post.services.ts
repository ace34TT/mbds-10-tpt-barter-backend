import { prisma } from "../configs/prisma.configs";
import { IPost } from "../shared/interfaces/prismaModels.interfaces";

export const getActivePostService = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: { deletedAt: null },
      include: {
        objects: {
          include: {
            object: {
              include: {
                category: true,
              },
            },
          },
        },
        suggestions: true,
        author: true,
      },
    });
    return posts;
  } catch (error) {}
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
  } catch (error) {
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
