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

const selSet = ['title', 'comments.content', 'comments.updatedAt'] as const;

type CustomSelSet = SelectionSet<Post, typeof selSet>;

async function test() {
  const {
    data: [post],
  } = await client.models.Post.list({
    selectionSet: selSet,
  });
}
