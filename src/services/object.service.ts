import prisma from '../configs/prisma.configs';

/*export const getObjects = async () => {
    return prisma.object.findMany();
};*/

export const getObjects = async (page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const totalDocs = await prisma.object.count();
    const totalPages = Math.ceil(totalDocs / limit);

    const objects = await prisma.object.findMany({
        skip: startIndex,
        take: limit,
        where: { deletedAt: null },
        include: {
            category: true,
            owner: true,
        }
    });

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        data: objects,
        totalDocs,
        totalPages,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage,
    }
};


export const getObjectById = async (id: number) => {
    return prisma.object.findUnique({
        where: { id },
    });
};

export const getObjectByOwner = async (ownerId: number,page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const totalDocs = await prisma.object.count();
    const totalPages = Math.ceil(totalDocs / limit);

    const objects = await prisma.object.findMany({
        include: {
            category: true,
            owner: true,
        },
        where: { ownerId: ownerId }
    });

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        data: objects,
        totalDocs,
        totalPages,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage,
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