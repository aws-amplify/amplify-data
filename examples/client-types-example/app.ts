import { generateClient } from 'aws-amplify/api';
import type { Schema } from './resource';

const client = generateClient<Schema>();

async function createPost() {}

async function test() {
  const res = await client.models.Network.list({
    selectionSet: [
      'name',
      'articles.*',
      'articles.articleOriginalWorks.person.name',
    ],
  });
}
