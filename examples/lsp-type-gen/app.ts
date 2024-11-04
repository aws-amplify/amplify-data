import { generateClient } from 'aws-amplify/api';
import type { Schema } from './schema.d.ts';

const client = generateClient<Schema>();

async function test() {
  const res = await client.models.Post.create({
    title: 'hello',
    description: 'desc',
  });

  console.log();
}
