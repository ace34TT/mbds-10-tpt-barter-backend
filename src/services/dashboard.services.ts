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