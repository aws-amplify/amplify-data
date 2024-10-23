import * as fs from 'fs';
import * as crypto from 'crypto';

let lastHash = '';

export function fileHashChanged(fileName: string): boolean {
  // Function to calculate hash using SHA256
  const calculateHash = (content: string): string => {
    return crypto.createHash('sha256').update(content).digest('hex');
  };

  // Read the file content
  const fileContent = fs.readFileSync(fileName, 'utf8');

  // Calculate the hash
  const currentHash = calculateHash(fileContent);

  if (lastHash !== currentHash) {
    lastHash = currentHash;
    return true;
  } else {
    return false;
  }
}
