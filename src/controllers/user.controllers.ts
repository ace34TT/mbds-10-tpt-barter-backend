import { Request, Response } from 'express';
import prisma from '../configs/prisma.configs'; 

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
    res.json(user);
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
