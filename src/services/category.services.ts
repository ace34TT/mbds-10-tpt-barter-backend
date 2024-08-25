import prisma from '../configs/prisma.configs';

export const getCategories = async () => {
    return prisma.category.findMany();
};

export const getCategoryById = async (id: number) => {
    return prisma.category.findUnique({
        where: {id},
    });
};

export const createCategory = async (title: string) => {
    return prisma.category.create({
        data: {title},
    });
};


export const updateCategory = async (id: number, title: string) => {
    return prisma.category.update({
      where: { id },
      data: { title },
    });
  };
  
export const deleteCategory = async (id: number) => {
    return prisma.category.delete({
        where: { id },
    });
};

export const categoryTitleExists = async (title: string) => {
    const category = await prisma.category.findFirst({
        where: { title: title },
    });
    return !!category;
};




// admin
export const getCategoriesWithPagination = async (page: number, limit: number, title?: string) => {
    const skip = (page - 1) * limit;
    return prisma.category.findMany({
        skip,
        take: limit,
        where: {
            title: title ? {
              contains: title,
              mode: 'insensitive', // Optionnel
            } : undefined,
          },
    });
};