import { API } from 'aws-amplify';
import type { Schema } from './resource';

const client = API.generateClient<Schema>();

async function test() {
  const [post] = await client.models.Post.list();
  const pTags = await post.tags();
  if (pTags) {
    const [pTag] = pTags;
    if (pTag) {
      const tag = pTag.tag();
    }
  }
}

/**
 * TODOs:
 *
 * SelectionSet utility type
 * Clientside changes to flatten all `items` to match return type
 * Return initialized model instead? Per Jon's suggestions
 */
