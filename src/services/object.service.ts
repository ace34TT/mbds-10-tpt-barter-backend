import prisma from "../configs/prisma.configs";

export const getObjects = async () => {
  return prisma.object.findMany();
};

export const getObjectById = async (id: number) => {
  return prisma.object.findUnique({
    where: { id },
  });
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

export const updateObject = async (
  id: number,
  data: {
    name?: string;
    categoryId?: number;
    description?: string;
    ownerId?: number;
  }
) => {
  return prisma.object.update({
    where: { id },
    data,
  });
};

export const deleteObject = async (id: number) => {
  return prisma.object.delete({
    where: { id },
  });
};

export const getObjectsByUser = async (userId: number) => {
  try {
    return prisma.object.findMany({
      where: { ownerId: userId },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to retrieve objects for user ${userId}: ${error.message}`
    );
  }
};
