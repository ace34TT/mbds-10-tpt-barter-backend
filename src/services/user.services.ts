import prisma from "../configs/prisma.configs";

// admin
export const getUsersWithPagination = async (page: number, limit: number, email?: string, roleId?: number) => {
    const skip = (page - 1) * limit;
    return prisma.user.findMany({
        skip,
        take: limit,
        where: {
          ...(email && {
            OR: [
              { email: { contains: email, mode: 'insensitive' } },
              { name: { contains: email, mode: 'insensitive' } },
              { username: { contains: email, mode: 'insensitive' } },
            ],
          }),
          ...(roleId && { roleId: roleId }), // Add roleId filter
        },
    });
};