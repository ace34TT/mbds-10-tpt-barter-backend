import prisma from '../configs/prisma.configs';

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

export const updateObject = async (id: number, data: {
    name?: string;
    categoryId?: number;
    description?: string;
    ownerId?: number;
    photos?: string[];
    }) => {
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