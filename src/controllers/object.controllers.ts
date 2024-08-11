import { NextFunction, Request, Response } from "express";
import { createObject, deleteObject, getObjectById, getObjectByOwner, getObjects, updateObject } from "../services/object.service";
import dotenv from "dotenv";
import { APIError } from "../shared/utils/errors/BaseError";

dotenv.config();

export const getObjectsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if(page == 0) {
      page = 1;
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const objects = await getObjects(page, limit);
    return res.status(200).json(objects);
  } catch (error) {
    console.log(error);
    next(new APIError("Internal server error", 500));
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

export const getObjectByOwnerHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if(page == 0) {
      page = 1;
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const object = await getObjectByOwner(Number(id), page, limit);
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
  try {
    console.log(req.body);

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


    const fileIds = reqfiles.files.map(files => {
      var file = files as Express.MulterS3.File;
      return `${cdnUrl}/${file.key}`;
    });

    const { name, categoryId, description, ownerId } = req.body;

    const newObject = {
      name,
      categoryId: Number(categoryId),
      description,
      ownerId: Number(ownerId),
      photos: fileIds
    };

    var createdObject = await createObject(newObject);

    return res.status(201).json(createdObject);
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

export const getObjectByUserHandler = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const objects = await getObjectsByUser(Number(userId));
    return res.status(200).json(objects);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve objects" });
  }
};
