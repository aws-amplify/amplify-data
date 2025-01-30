import { type AmplifySqlMigration } from "../../../src/index";
import { a } from "../../../src/index";
import { Schema } from "./schema-definition";
import type { Prettify } from '@aws-amplify/data-schema-types';

type _Prettied = Prettify<Schema>;

export const migration: AmplifySqlMigration<Schema> = {
  steps: [
    {
      up: a.sqlMigration.createTable({
        name: 'Address',
        columns: [
          { name: 'state', type: 'string' },
          { name: 'zip', type: 'string' },
        ],
      }),
      down: a.sqlMigration.dropTable({
        name: 'Address',
      }),
    },
  ],
};

