import { sqlSchema } from '../amplify/data/resource';
import * as fs from 'fs';

const currentSchema = sqlSchema.transform();
if (fs.existsSync('./schema-snapshot.json')) {
  const priorSchema = JSON.parse(fs.readFileSync('./schema-snapshot.json', 'utf8'));
  if (JSON.stringify(currentSchema) === JSON.stringify(priorSchema)) {
    console.log('No changes detected.');
    process.exit(0);
  }
}

fs.writeFileSync('./schema-snapshot.json', JSON.stringify(currentSchema, null, 4));
