import { API } from 'aws-amplify';
import type { Schema } from './resource';
import type {
  ExtractModelMeta,
  Prettify,
  UnwrapArray,
  SelectionSet,
} from '@aws-amplify/amplify-api-next-types-alpha';

const client = API.generateClient<Schema>();

type Post = Schema['Post'];

type CustomSelSet = SelectionSet<
  Post,
  ['title', 'comments.content', 'comments.updatedAt']
>;

async function test() {
  const [post] = await client.models.Post.list({
    selectionSet: ['title', 'comments.content', 'comments.updatedAt'],
  });
}
