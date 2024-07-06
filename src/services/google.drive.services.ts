import { google } from 'googleapis';
import * as fs from 'fs';
import drive from '../configs/google.drive.configs';
import stream from "stream";
export const uploadFileToDrive = async (files: Express.Multer.File[]): Promise<string[]> => {
  try {
    
    const fileUrls: string[] = [];
    for (const file of files) {
      const response = await drive.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
          parents: ["1g2QXOsP0NE2Bv0rSLGBMsyLA5CJeDSqY"]
        },
        media: {
          mimeType: file.mimetype,
          body: new stream.PassThrough().end(file.buffer),
        },
      });

      if (response.data && response.data.id) {
        const fileUrl = "https://drive.google.com/uc?export=view&id="+response.data.id; // Return Google Drive file ID
        fileUrls.push(fileUrl);
      } else {
        throw new Error('Failed to get file ID from Google Drive response');
      }

    }
    return fileUrls;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
};