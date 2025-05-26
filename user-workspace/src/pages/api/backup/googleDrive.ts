import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const KEYFILEPATH = path.join(process.cwd(), 'credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadBackup(filePath: string, fileName: string) {
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType: 'application/json',
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });
    return response.data.id;
  } catch (error) {
    throw new Error('Failed to upload backup to Google Drive: ' + error);
  }
}

export async function downloadBackup(fileId: string, destPath: string) {
  const dest = fs.createWriteStream(destPath);

  try {
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new Promise((resolve, reject) => {
      response.data
        .on('end', () => {
          resolve(true);
        })
        .on('error', (err: any) => {
          reject(err);
        })
        .pipe(dest);
    });
  } catch (error) {
    throw new Error('Failed to download backup from Google Drive: ' + error);
  }
}
