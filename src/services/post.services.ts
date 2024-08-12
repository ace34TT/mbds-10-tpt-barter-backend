import { prisma } from "../configs/prisma.configs";
import { IPost } from "../shared/interfaces/prismaModels.interfaces";

/*export const getActivePostService = async () => {
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
    console.log(posts);
    return posts;
  } catch (error) { }
};*/

export const getPostService = async (postId: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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

    return post;
  } catch (error) {
    throw error;
  }
};

export const getAllPostService = async (page: number, limit: number) => {
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
  } catch (error:any) {
    console.error(error);
    console.log(error.message);
    throw new Error('An error occurred while fetching posts.');
  }
};

export const createPostService = async (post: IPost) => {
  try {
    const _post = await prisma.post.create({
      data: {
        author: { connect: { id: post.authorId } },
        description: post.description,
        objects: {
          create: post.objectIds.map((objectId) => ({
            object: { connect: { id: objectId } },
          })),
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


export const getUserPostService = async (authorId: number, page: number, limit: number) => {
  try {
    const startIndex = (page - 1) * limit;
    const totalDocs = await prisma.post.count();
    const totalPages = Math.ceil(totalDocs / limit);

    const posts = await prisma.post.findMany({
      skip: startIndex,
      take: limit,
      where: { authorId: authorId },
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
      orderBy: {
        createdAt: 'desc',
      }
    });

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: posts,
      totalDocs,
      totalPages,
      nextPage,
      prevPage,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error) {
    throw error;
  }
};

export const getActivePostService = async (page: number, limit: number, userId: number) => {
  try {
    const startIndex = (page - 1) * limit;
    const totalDocs = await prisma.post.count();
    const totalPages = Math.ceil(totalDocs / limit);

    const posts = await prisma.post.findMany({
      skip: startIndex,
      take: limit,
      where: {
        authorId: {
          not: userId,
        },
        deletedAt: null
      },
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
      orderBy: {
        createdAt: 'desc',
      }
    });

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: posts,
      totalDocs,
      totalPages,
      nextPage,
      prevPage,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error) { }
};

export const getExploreItemPostService = async (userId: number) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          not: userId,
        },
        deletedAt: null,
      },
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
  } catch (error) {
    throw error;
  }
};


export const addSuggestionToPostService = async (postId:number , objectIds:number[], suggestedById:number) => {
  const suggestion = await prisma.suggestion.create({
    data: {
      post: {
        connect: { id: postId },
      },
      status: 'PENDING', // ou un autre statut par défaut
      suggestedBy: { connect: { id: suggestedById } },
    },
  });

  // Créez les enregistrements ObjectSuggestion
  const objectSuggestions = objectIds.map(objectId => ({
    objectId,
    suggestionId: suggestion.id,
  }));

  await prisma.objectSuggestion.createMany({
    data: objectSuggestions,
  });
}

export const getPostSuggestions = async (postId: number) =>{
  try {
    const postWithSuggestions = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        suggestions: {
          include: {
            suggestedObject: {
              include: {
                object: true, // Inclure les détails des objets associés
              },
            },
          },
        },
      },
    });

    if (!postWithSuggestions) {
      throw new Error(`Post with id ${postId} not found`);
    }

    return postWithSuggestions.suggestions;
  } catch (error:any) {
    console.error(`Error fetching suggestions for post ${postId}: ${error.message}`);
    throw new Error('An error occurred while fetching suggestions.');
  }
}