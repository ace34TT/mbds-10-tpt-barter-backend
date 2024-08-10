import prisma from "../configs/prisma.configs";

// admin
export const getUsersWithPagination = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return prisma.user.findMany({
        skip,
        take: limit,
    });
};