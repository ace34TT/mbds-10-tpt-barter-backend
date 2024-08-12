import { NextFunction, Request, Response } from "express";
import { createObject, deleteObject, getObjectById, getObjectByOwner, getObjects, getObjectByOwnerList, getObjectsByUser, updateObject } from "../services/object.service";
import dotenv from "dotenv";
import { APIError } from "../shared/utils/errors/BaseError";
import { getObjectByIdAllData, getObjectsPagin, deleteObjectService} from "../services/object.service";
import { validationResult } from "express-validator";
import { uploadFileToDrive } from "../services/google.drive.services";

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

export const getObjectsPaginHandler = async (req: Request, res: Response) => {
  try {
    let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if(page == 0) {
      page = 1;
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    console.log(req.query);
    
    const result = await getObjectsPagin(page, limit);

    return res.status(200).json(result);
  } catch ( err: any) {
    return res.status(500).json({ error: err.message });
  }
};


export const getObjectByIdAllDataHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const object = await getObjectByIdAllData(Number(id));
    return res.status(200).json(object);
  } catch (error: any) {
    console.error("Error in getObjectByIdController:", error);
    return res.status(404).json({ error: error.message });
  }
};

export const getObjectByOwnerListHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const object = await getObjectByOwnerList(Number(id));
    return res.status(200).json(object);
  } catch (error: any) {
    console.error("Error in getObjectByIdController:", error);
    return res.status(404).json({ error: error.message });
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
  } catch (error: any) {
    console.log(error.message)
    return res.status(500).json({ error: "Failed to delete object" });
  }
};

interface MulterRequestWithFiles extends Request {
  files: Express.Multer.File[];
}

export const deleteObjectStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedObject = await getObjectById(Number(id));
    if (!deletedObject) {
      return res.status(404).json({ error: "Object not found" });
    }

    await deleteObjectService(Number(id));
    return res.status(200).json({ message: "Object deleted successfully" });
  } catch (error: any) {
    console.log(error.message)
    return res.status(500).json({ error: "Failed to delete object" });
  }
};
/*
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
    const fileIds = await uploadFileToDrive(files);
    const { name, categoryId, description, ownerId } = req.body;


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
*/

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
    console.log(reqfiles);

    console.log(req.body);

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
  const { name, categoryId, description, ownerId,photos } = req.body;
  console.log(req.body);
  try {
    const existingObject = await getObjectById(Number(id));
    if (!existingObject) {
      return res.status(404).json({ error: "Object not found" });
    }
    const updatedObject = await updateObject(Number(id), { name: name, categoryId: categoryId, description: description, ownerId: ownerId ,photos});
    return res.status(200).json(updatedObject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update object" });
  }
};
/*
export const updateObjectOwnerHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ownerId } = req.body;
  console.log(req.body);
  try {
    const existingObject = await getObjectById(Number(id));
    if (!existingObject) {
      return res.status(404).json({ error: "Object not found" });
    }
    const updatedObject = await updateObject(Number(id), { ownerId: ownerId});
    return res.status(200).json(updatedObject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update object" });
  }
};
*/
export const getObjectByUserHandler = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const objects = await getObjectsByUser(Number(userId));
    return res.status(200).json(objects);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve objects" });
  }
};

export const updateObjectWithPhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, categoryId, description, ownerId } = req.body;
  const reqfiles = req as MulterRequestWithFiles;

  console.log( req.body);

  try {
    // Récupérer l'objet existant
    const existingObject = await getObjectById(Number(id));
    if (!existingObject) {
      return res.status(404).json({ error: "Object not found" });
    }

    // Conserver les photos existantes
    const existingPhotos = existingObject.photos || [];
    
    // Ajouter les nouvelles photos
    const bucketName = process.env.SPACES_NAME!;
    const cdnUrl = `https://${bucketName}.ams3.cdn.digitaloceanspaces.com`;
    
    const newPhotoUrls = reqfiles.files.map(files => {
      var file = files as Express.MulterS3.File;
      return `${cdnUrl}/${file.key}`;
    });


    // Combiner les anciennes et nouvelles photos
    const updatedPhotos = [...existingPhotos, ...newPhotoUrls];

    // Mettre à jour l'objet
    const updatedObject = await updateObject(Number(id), {
      name,
      categoryId: Number(categoryId),
      description,
      ownerId: Number(ownerId),
      photos: updatedPhotos
    });

    return res.status(201).json(updatedObject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update object" });
  }
};
