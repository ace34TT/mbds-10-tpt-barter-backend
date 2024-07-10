import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../configs/prisma.configs'; // Importation de l'instance Prisma

// Fonction d'inscription
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, username, password, roleId } = req.body;
    console.log(req.body);
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant avec cet email' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = await prisma.user.create( {data: {
      name,
      email,
      username,
      password: hashedPassword,
      roleId,
    }},);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Fonction de connexion
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user ,token });
  } catch (error) {
    res.status(500).json({error});
  }
};

