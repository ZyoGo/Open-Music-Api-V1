import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

if (!fs.existsSync('testFolder')) {
	fs.mkdirSync('testFolder', { recursive: true });
}
