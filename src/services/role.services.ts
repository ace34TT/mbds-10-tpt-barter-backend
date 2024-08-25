import prisma from '../configs/prisma.configs';

export const getRoles = async () => {
    return prisma.role.findMany();
};