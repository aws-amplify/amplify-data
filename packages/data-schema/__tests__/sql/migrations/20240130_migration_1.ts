import { type AmplifySqlMigration } from "../../../src/index";
import { a } from "../../../src/index";
import { Schema } from "./schema-definition";
import type { Prettify } from '@aws-amplify/data-schema-types';

type Prettied = Prettify<Schema>;

export const migration: AmplifySqlMigration = {
  steps: [
    {
      up: a.sqlMigration.createTable({
        name: 'User',
        columns: [
          { name: 'id', type: 'uuid' },
          { name: 'name', type: 'string' },
        ],
      }),
      down: a.sqlMigration.dropTable({
        name: 'User',
      }),
    },
  ],
};

