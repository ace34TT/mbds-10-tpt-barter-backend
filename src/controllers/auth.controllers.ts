import { extractZodErrors } from "./../shared/utils/errors/error.utils";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../configs/prisma.configs";
import { loginSchema, userSchema } from "../shared/schemas/auth.schema";
import { ZodError } from "zod";
import {
  HTTP400Error,
  UnauthorizedError,
} from "../shared/utils/errors/BaseError";
require("dotenv").config();

export const AuthController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("calling register function");
      // userSchema.parse(req.body);
      console.log("after parse");

      const { name, email, username, password, roleId } = req.body;
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Utilisateur déjà existant avec cet email" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          password: hashedPassword,
          roleId,
        },
      });
      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.log(extractZodErrors(error));
        next(new HTTP400Error(extractZodErrors(error)));
        return;
      }
      res.status(500).json({ error });
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("calling login function");
      loginSchema.parse(req.body);
      console.log(req.body);

      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        next(new UnauthorizedError("Email not found"));
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        next(new UnauthorizedError("Incorrect password"));
        return;
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      console.log("user logged");

      return res.status(200).json({ user, token });
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        next(new HTTP400Error(extractZodErrors(error)));
        return;
      }
      res.status(500).json({ error });
    }
  },
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
    console.log(error)
    res.status(500).json({error});
  }
};

