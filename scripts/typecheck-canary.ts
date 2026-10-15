import { spawnSync } from 'child_process';

/**
 * Type-checks the projects that make up our customer-facing type contract, plus
 * our own sources, with whichever `typescript` is installed at the repo root.
 *
 * Used by the TypeScript canary (.github/workflows/callable-ts-version-unit-test.yml),
 * which swaps the root `typescript` for an upcoming release before running this.
 * Every project is checked even if an earlier one fails, so one run shows the
 * full picture for a given TypeScript version.
 */
const projects = [
  // Customer contract: these consume the built `dist/**/*.d.ts` of
  // @aws-amplify/data-schema(-types) through workspace resolution, the same way
  // an app that installs the published packages does.
  'packages/integration-tests',
  'examples/tsc-compliance',
  // Our own sources on the target compiler. `__tests__` are excluded by the
  // build tsconfigs; jest covers them on the pinned TypeScript in pr.yml.
  'packages/data-schema/tsconfig.build.json',
  'packages/data-schema-types/tsconfig.build.json',
];

const failed: string[] = [];

for (const project of projects) {
  console.log(`\n== tsc --noEmit -p ${project} ==`);
  const result = spawnSync('tsc', ['--noEmit', '-p', project], {
    stdio: 'inherit',
  });
  if (result.error) {
    console.error(result.error.message);
  }
  if (result.status !== 0) {
    failed.push(project);
  }
}

if (failed.length > 0) {
  console.error(`\nType-check failed for: ${failed.join(', ')}`);
  process.exit(1);
}
console.log('\nType-check passed for all projects.');
