import { Request, Response } from "express";
import { createObject, deleteObject, getObjectById, getObjects, updateObject } from "../services/object.service";
import dotenv from "dotenv";

dotenv.config();

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

interface MulterRequestWithFiles extends Request {
  files: Express.Multer.File[];
}

export const createObjectHandler = async (req: Request, res: Response) => {
  try{
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // const files: Express.Multer.File[] = req.files as Express.Multer.File[];;
    // if (!files || files.length === 0) {
    //   return res.status(400).json({ error: 'No files uploaded' });
    // }

    // const fileIds = await uploadFileToDrive(files);
    const reqfiles = req as MulterRequestWithFiles;

    if (!reqfiles || reqfiles.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const bucketName = process.env.SPACES_NAME!;
    const cdnUrl = `https://${bucketName}.ams3.cdn.digitaloceanspaces.com`;

    // Générer les URLs CDN pour les fichiers
    const fileIds = reqfiles.files.map(files => {
      var file = files as Express.MulterS3.File;
      return `${cdnUrl}/${file.key}`;
    });

    const { name, categoryId, description, ownerId } = req.body;

    // Remplacer createObject par la logique appropriée pour créer un objet
    const newObject = {
      name,
      categoryId: Number(categoryId),
      description,
      ownerId: Number(ownerId),
      photos: fileIds
    };

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
    const updatedObject = await updateObject(Number(id), { name: name, categoryId: categoryId, description: description, ownerId: ownerId });
    return res.status(200).json(updatedObject);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Failed to update object" })
    ;
  }
};