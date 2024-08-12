import { prisma } from "./../configs/prisma.configs";
import { Suggestion } from "../shared/schemas/suggestion.schema";
import { SuggestionStatus } from "@prisma/client";

export const sendSuggestionService = async (suggestion: Suggestion) => {
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

      // Update the suggestion status to ACCEPTED
      await prisma.suggestion.update({
        where: { id: suggestionId },
        data: { status },
      });

      // Update the object owner to the user who made the suggestion
      if (status === "ACCEPTED") {
        await prisma.object.update({
          where: { id: suggestion.suggestedObject[0].objectId },
          data: { ownerId: suggestion.suggestedById },
        });
      }
    });

    console.log("Suggestion accepted and object owner updated successfully");
  } catch (error) {
    console.error("Error accepting suggestion:", error);
  } finally {
    await prisma.$disconnect();
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
        post: true,        
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
