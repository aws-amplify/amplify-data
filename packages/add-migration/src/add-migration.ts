import * as path from 'path';
import * as fs from 'fs';

const currentDir: string = process.cwd();
const dataPath: string = path.join(currentDir, 'amplify/data/resource.ts');

if (fs.existsSync(dataPath)) {
  import(dataPath).then((localData) => {
    console.log('Imported data:', localData);
  });
  // Process the imported data as needed
} else {
  console.error('Exported data file not found in the local project.', dataPath);
}