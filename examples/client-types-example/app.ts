import { generateClient } from 'aws-amplify/api';
import type { Schema } from './resource';

const client = generateClient<Schema>();

async function test() {

  // this would throw a TS2590 error previously
  const res = await client.models.Network.list({
    selectionSet: [
      'name',
      'articles.*',
      'articles.articleOriginalWorks.person.name',
    ],
  });
}
