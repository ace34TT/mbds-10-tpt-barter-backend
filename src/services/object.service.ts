import prisma from '../configs/prisma.configs';

export const getObjects = async () => {
    return prisma.object.findMany();
};

export const getObjectById = async (id: number) => {
    return prisma.object.findUnique({
        where: { id },
    });
};



export const getObjectByIdAllData = async (id: number) => {
  try {
    const object = await prisma.object.findUnique({
      where: { id: id },
      include: {
        category: true,
        owner: true,
        posts: true,
        suggestions: true,
      },
    });

    if (!object) {
      throw new Error('Object not found');
    }

    return object;
  } catch (error) {
    console.error("Error retrieving object by ID:", error);
    throw new Error("Failed to retrieve object");
  }
};

export const getObjectsPagin = async (page: number, limit: number) => {
    try {
      const startIndex = (page - 1) * limit;
      console.log(startIndex);
    
      const totalDocs = await prisma.object.count();
      const totalPages = Math.ceil(totalDocs / limit);
    
      const objects = await prisma.object.findMany({
        skip: startIndex,
        take: limit,
        include: {
          category: true,
          owner: true,
          posts: true,
          suggestions: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;
    
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
    
      return {
        objects: objects.map(object => ({
          id: object.id.toString(), // Assume id is a number and needs to be converted to string
          name: object.name,
          category: {
            id: object.category.id,
            title: object.category.title,
          },
          description: object.description,
          owner: {
            id: object.owner.id.toString(), // Assume id is a number and needs to be converted to string
            name: object.owner.name,
            email: object.owner.email,
          },
          photo: object.photos, // Changed to 'photo' based on interface
          posts: object.posts.map(post => ({
            id: post.id.toString(), // Assuming post.id is a number and needs to be converted to string
            // Include other properties of the post as needed
          })),
          suggestions: object.suggestions.map(suggestion => ({
            id: suggestion.id.toString(), // Assuming suggestion.id is a number and needs to be converted to string
            // Include other properties of the suggestion as needed
          })),
          createdAt: object.createdAt.toISOString(), // Convert Date to ISO string
          updatedAt: object.updatedAt.toISOString(), // Convert Date to ISO string
        })),
        totalDocs,
        totalPages,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage,
      };
    } catch (err) {
      console.error("Error retrieving objects with pagination:", err);
      throw new Error("Failed to retrieve objects");
    }
  };

export const createObject = async (data: {
    name: string;
    categoryId: number;
    description: string;
    ownerId: number;
    photos: string[];
    }) => {
        return prisma.object.create({
            data,
        });
};

export const updateObject = async (id: number, data: {
    name?: string;
    categoryId?: number;
    description?: string;
    ownerId?: number;
    photos : string[]
    }) => {
        return prisma.object.update({
            where: { id },
            data,
        });
};

export const deleteObject = async (id: number) => {7
  console.log(id);
    return prisma.object.delete({
        where: { id },
    });
};