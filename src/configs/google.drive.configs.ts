import { google } from 'googleapis';
import * as fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'src/credentials/upload-credentials.json', // Replace with actual path
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export default drive;