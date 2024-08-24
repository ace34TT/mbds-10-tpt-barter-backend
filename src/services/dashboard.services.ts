import prisma from '../configs/prisma.configs';
import { IObjetReport, IReport, IUserReport, Report } from "../models/report.models";

export const countPendingReport = async (): Promise<number> => {
    try {
        return await Report.countDocuments({ statut: 'pending' });
    } catch (error) {
        throw error;
    }
};

export const countAcceptedReport = async (): Promise<number> => {
    try {
        return await Report.countDocuments({ statut: 'accepted' });
    } catch (error) {
        throw error;
    }
};

export const countRejectedReport = async (): Promise<number> => {
    try {
        return await Report.countDocuments({ statut: 'rejected' });
    } catch (error) {
        throw error;
    }
};

export const countUsers = async () : Promise<number> => {
    try {
        return await prisma.user.count();
    } catch (error) {
        throw error;
    }
}

export const countDeclinedExchange = async (): Promise<number> => {
    try{
        return await prisma.suggestion.count({
            where: {
                status: 'DECLINED'
            }
        })
    }catch(error){
        throw error;
    }
}


export const countDailyExchange = async (): Promise<number> => {
    try{
        const today = new Date();
        today.setHours(0,0,0,0);

        // Obtenez le nombre total d'échanges avant aujourd'hui
        const totalExchanges = await prisma.suggestion.count({
            where: {
                createdAt: {
                    lt: today,
                },
                status: 'ACCEPTED'
            }
        });

        // Obtenez le nombre de jours depuis le premier échange
        const firstExchange = await prisma.suggestion.findFirst({
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (!firstExchange) {
            return 0; // Aucun échange trouvé
        }

        const diffTime = Math.abs(today.getTime() - firstExchange.createdAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Retournez la moyenne d'échanges par jour
        return totalExchanges / diffDays;
    }catch(error){
        throw error;
    }
}

export const getExchangesForLast14Days = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const exchangesByDay = [];
  
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
  
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
  
      const count = await prisma.suggestion.count({
        where: {
          status: 'ACCEPTED',
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
  
      exchangesByDay.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        count: count
      });
    }

    console.log(exchangesByDay);
  
    return exchangesByDay;
};

export const getDeclinedExchangesForLast14Days = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const exchangesByDay = [];
  
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
  
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
  
      const count = await prisma.suggestion.count({
        where: {
          status: 'DECLINED',
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
  
      exchangesByDay.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        count: count
      });
    }

    console.log(exchangesByDay);
  
    return exchangesByDay;
};


export const getTop5Categories = async () => {
    try {

        // Step 1: Count the number of suggestions for each object
        const objectCounts = await prisma.objectSuggestion.groupBy({
          by: ['objectId'],
          _count: {
            id: true,
          },
        });

        console.log("step 1 done");
    
        // Step 2: Get the objects with their counts
        const objectsWithCounts = await prisma.object.findMany({
          where: {
            id: {
              in: objectCounts.map(count => count.objectId),
            },
          },
          select: {
            id: true,
            categoryId: true,
            _count: {
              select: {
                suggestions: true,
              },
            },
          },
        });
        console.log("step 2 done");
    
        // Step 3: Aggregate the counts by category
        const categoryCounts = objectsWithCounts.reduce((acc, obj) => {
          if (!acc[obj.categoryId]) {
            acc[obj.categoryId] = 0;
          }
          acc[obj.categoryId] += obj._count.suggestions;
          return acc;
        }, {} as Record<number, number>);

        console.log("step 3 done");
    
        // Step 4: Retrieve category details and sort them
        const topCategories = await prisma.category.findMany({
          where: {
            id: {
              in: Object.keys(categoryCounts).map(id => parseInt(id)),
            },
          },
          select: {
            id: true,
            title: true,
          },
        });

        console.log("step 4 done");
    
        // Step 5: Combine category details with counts and sort
        const sortedCategories = topCategories
          .map(category => ({
            ...category,
            suggestionCount: categoryCounts[category.id] || 0,
          }))
          .sort((a, b) => b.suggestionCount - a.suggestionCount)
          .slice(0, 5);
    
        return sortedCategories;
      } catch (error) {
        console.error('Error fetching top categories:', error);
        throw new Error('Unable to fetch top categories');
      }
}