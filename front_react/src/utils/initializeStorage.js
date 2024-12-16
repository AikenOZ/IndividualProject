import fs from 'fs';
import path from 'path';

const storagePath = path.resolve(__dirname, 'storage.json');

if (!fs.existsSync(storagePath) || fs.readFileSync(storagePath, 'utf8').trim() === '') {
  console.log('Initializing storage.json with default structure...');
  const defaultStructure = JSON.stringify({ user: { id: 'user1', rules: [] } }, null, 2);
  fs.writeFileSync(storagePath, defaultStructure);
}
