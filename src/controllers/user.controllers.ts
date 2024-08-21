import { Request, Response } from 'express';
import prisma from '../configs/prisma.configs'; 
import { getUsersWithPagination } from '../services/user.services';

// Créer un nouvel utilisateur
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, username, password, roleId } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password,
        roleId,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};

export const setUserPlayerIdHandler = async (req: Request, res: Response) => {
  try {
    const { userId, playerId } = req.body;
    console.log("setting userId and playerId" , userId, playerId);
    if (!userId ||!playerId) {return res.status(400).json({ error: 'Veuillez fournir'})}
    const user = await prisma.user.update({
      data: {playerId: playerId},
      where: {id: Number(userId)},
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du joueur' });
  }
}


// Obtenir tous les utilisateurs
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({error});
  }
};

// Obtenir un utilisateur par ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({error});
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, username, roleId } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, username,roleId },
    });
    res.json({message:"mis à jour effectué" ,user});
  } catch (error) {
    res.status(500).json({ error});
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error });
  }
};


// ADMIN
export const getUsersAdminHandler = async (req: Request, res: Response) => {
  
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await getUsersWithPagination(page, limit);
    const totalUsers = await prisma.user.count();
    return res.status(200).json({
      data: users,
      meta: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch(error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};