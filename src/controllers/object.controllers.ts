import { Request, Response } from "express";
import {
  createObject,
  deleteObject,
  getObjectById,
  getObjects,
  updateObject,
} from "../services/object.service";
import { validationResult } from "express-validator";
import { uploadFileToDrive } from "../services/google.drive.services";

export const getObjectsHandler = async (req: Request, res: Response) => {
  try {
    const objects = await getObjects();
    return res.status(200).json(objects);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve objects" });
  }
};

export const getObjectByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const object = await getObjectById(Number(id));
    if (!object) {
      return res.status(404).json({ error: "Object not found" });
    }
    return res.status(200).json(object);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve object" });
  }
};

export const deleteObjectHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedObject = await getObjectById(Number(id));
    if (!deletedObject) {
      return res.status(404).json({ error: "Object not found" });
    }

    await deleteObject(Number(id));
    return res.status(200).json({ message: "Object deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete object" });
  }
};

export const createObjectHandler = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileIds = await uploadFileToDrive(files);
    const { name, categoryId, description, ownerId, photos } = req.body;

    const newObject = await createObject({
      name,
      categoryId: Number(categoryId),
      description,
      ownerId: Number(ownerId),
      photos: fileIds,
    });
    return res.status(201).json(newObject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create object" });
  }
};

export const updateObjectHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, categoryId, description, ownerId } = req.body;
  try {
    const existingObject = await getObjectById(Number(id));
    if (!existingObject) {
      return res.status(404).json({ error: "Object not found" });
    }
    const updatedObject = await updateObject(Number(id), {
      name: name,
      categoryId: categoryId,
      description: description,
      ownerId: ownerId,
    });
    return res.status(200).json(updatedObject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update object" });
  }
};
