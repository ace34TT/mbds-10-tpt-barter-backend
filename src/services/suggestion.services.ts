import { prisma } from "./../configs/prisma.configs";
import { Suggestion } from "../shared/schemas/suggestion.schema";
import { SuggestionStatus } from "@prisma/client";

export const sendSuggestionService = async (suggestion: Suggestion) => {
  console.log(suggestion);
  try {
    const _suggestion = await prisma.suggestion.create({
      data: {
        postId: suggestion.postId,
        suggestedById: suggestion.suggestedById,
        status: suggestion.status || "PENDING",
        suggestedObject: {
          create: suggestion.suggestedObjectIds.map((objectId) => ({
            object: {
              connect: { id: objectId },
            },
          })),
        },
      },
      include: {
        suggestedObject: true,
      },
    });
    return _suggestion;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateSuggestionStatusService = async (
  status: SuggestionStatus,
  suggestionId: number
) => {
  try {
    await prisma.$transaction(async (prisma) => {
      // Fetch the suggestion and related data
      const suggestion = await prisma.suggestion.findUnique({
        where: { id: suggestionId },
        include: {
          suggestedBy: true,
          suggestedObject: {
            include: {
              object: true,
            },
          },
        },
      });

      if (!suggestion) {
        throw new Error("Suggestion not found");
      }

      const response = await prisma.suggestion.update({
        where: { id: suggestionId },
        data: { status },
      });

      if (status === "ACCEPTED") {
        const objetId = suggestion.suggestedObject.map((suggestedObject) => suggestedObject.objectId);
        await prisma.object.updateMany({
          where: { id: {in : objetId} },
          data: { ownerId: suggestion.suggestedById },
        });
      }
      
    });

    console.log("Suggestion accepted and object owner updated successfully");

  } catch (error) {
    console.error("Error accepting suggestion:", error);
  } 
};

export const getSuggestionsBySuggestedByIdAndStatus = async (authorId: number, page: number, limit: number, status?: SuggestionStatus) => {
  try {
    const startIndex = (page - 1) * limit;
    const totalDocs = await prisma.suggestion.count();
    const totalPages = Math.ceil(totalDocs / limit);

    const suggestions = await prisma.suggestion.findMany({
      skip: startIndex,
      take: limit,
      where: {
        post: {
          authorId: authorId, 
        },
        ...(status && { status: status }),
        deletedAt: null,
      },
      include: {
        suggestedObject: {
          include: {
            object: true,
            suggestion: true,
          },
        },
        post: {
          include: {
            objects: {
              include: {
                object: true
              }
            }
          }
        },        
        suggestedBy: true,
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
      data: suggestions,
      totalDocs,
      totalPages,
      nextPage,
      prevPage,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

export const getAllSuggestionsByStatus = async (page: number, limit: number, status?: SuggestionStatus) => {
  try {
    const startIndex = (page - 1) * limit;
    const totalDocs = await prisma.suggestion.count();
    const totalPages = Math.ceil(totalDocs / limit);

    const suggestions = await prisma.suggestion.findMany({
      where: {
        ...(status && { status: status }),
        deletedAt: null,
      },
      include: {
        suggestedObject: {
          include: {
            object: true,
            suggestion: true,
          },
        },
        post: true,        
        suggestedBy: true,
      },
    });

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: suggestions,
      totalDocs,
      totalPages,
      nextPage,
      prevPage,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error) {
    console.error('Error fetching suggestions:', error);
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
            suggestedBy: true,
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