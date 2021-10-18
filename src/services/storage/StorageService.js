import fs from 'fs';
// import path from 'path';

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const fileName = +new Date() + meta.filename;
    const pathFile = `${this._folder}/${fileName}`;

    const fileStream = fs.createWriteStream(pathFile);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(fileName));
    });
  }
}

export default StorageService;
