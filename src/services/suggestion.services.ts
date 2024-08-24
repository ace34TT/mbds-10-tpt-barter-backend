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