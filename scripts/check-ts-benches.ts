import { execa } from 'execa';

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

type BenchErrors = { file: string; message: string }[];

const BENCHES_ROOT_DIR = './packages/benches';
const FILE_SUFFIXES = ['CRUDL', 'selection-set'];

const BENCH_DEGRADATION_THRESHOLD = 1;

// Orchestrator; returns void when benches are within defined threshold, throws if threshold is exceeded
(async function runCheck() {
  const benchFilePaths = getBenchFilePaths(BENCHES_ROOT_DIR);
  const errors = await runBenches(benchFilePaths);

  processErrors(errors);
})();

/**
 *  Recurse through directory (dir) and retrieve all file paths that match global FILE_SUFFIXES pattern
 *
 * @param dir - starting directory
 * @returns - array of absolute file paths
 */
function getBenchFilePaths(dir: string): string[] {
  let results: string[] = [];
  const list: string[] = readdirSync(dir);
  list.forEach((file) => {
    file = join(dir, file);
    const stat = statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(getBenchFilePaths(file));
    } else {
      if (
        FILE_SUFFIXES.some((pattern) => file.endsWith(`-${pattern}.bench.ts`))
      ) {
        results.push(file);
      }
    }
  });
  return results;
}

/**
 * Execute benchmarks on all provided file paths; collect errors when threshold defined in BENCH_DEGRADATION_THRESHOLD is exceeded
 *
 * @param benchFilePaths - absolute paths of benchmark files to execute
 * @returns array of objects containing the filename and error message
 */
async function runBenches(benchFilePaths: string[]) {
  const errors: BenchErrors = [];

  await Promise.all(
    benchFilePaths.map(async (file) => {
      try {
        await execa('npx', [
          'tsx',
          file,
          '--benchErrorOnThresholdExceeded',
          '--benchPercentThreshold',
          String(BENCH_DEGRADATION_THRESHOLD),
        ]);
      } catch (error: any) {
        // The message is emitted twice in stderr; grabbing the first occurrence to reduce noise
        const [firstPart] = error.stderr.split('\n');
        errors.push({ file, message: firstPart });
      }
    }),
  );

  return errors;
}

const REMEDIATION_INSTRUCTIONS = `
If performance degradation is expected given the changes in this branch, run \`npm run baseline:benchmarks\` to baseline.

Otherwise, please identify and optimize the type-level changes that are causing this performance regression.
`;

/**
 * Print failed bench filename and error message to console; fail script
 *
 * @param errors
 */
function processErrors(errors: BenchErrors) {
  if (errors.length > 0) {
    console.error(
      `TypeScript benchmark threshold exceeded in ${errors.length} file(s):\n`,
    );

    for (const err of errors) {
      console.error('Bench filename: ', err.file, '\n');
      console.error(err.message, '\n');
    }

    throw new Error(
      `TypeScript Benchmark Threshold Exceeded\n${REMEDIATION_INSTRUCTIONS}`,
    );
  }
}
