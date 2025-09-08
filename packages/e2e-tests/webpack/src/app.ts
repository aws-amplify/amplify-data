import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();