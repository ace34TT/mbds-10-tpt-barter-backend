import { Request, Response } from "express";
import { getRoles } from "../services/role.services";

export const getRolesHandler = async (req: Request, res: Response) => {
    try{
      const roles = await getRoles();
      return res.status(200).json(roles);
    } catch(error) {
      return res.status(500).json({ error: "Failed to fetch roles" });
    }
};