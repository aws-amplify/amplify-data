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

  const start = new Date();
  let started = 0;
  let completed = 0;

  const updateStatus = () => {
    const elapsed = Math.floor((new Date().getTime() - start.getTime()) / 1000);
    process.stdout.write(
      `\rrunning: ${started}; done: ${completed}; elapsed: ${elapsed}s`,
    );
  };

  const tick = setInterval(updateStatus, 1000);

  await Promise.all(
    benchFilePaths.map(async (file) => {
      try {
        /**
         * Template string parameters are escaped automatically by execa. For details:
         * https://github.com/sindresorhus/execa/blob/HEAD/docs/escaping.md
         */
        started++;
        await execa('npx', [
          'tsx',
          file,
          '--benchErrorOnThresholdExceeded',
          '--benchPercentThreshold',
          String(BENCH_DEGRADATION_THRESHOLD),
        ]);
        completed++;
      } catch (error: any) {
        // The message is emitted twice in stderr; grabbing the first occurrence to reduce noise
        const [firstPart] = error.stderr.split('\n');
        errors.push({ file, message: firstPart });
      }
    }),
  );

  clearInterval(tick);

  updateStatus();
  console.log(`\n\nDone.`);

  return errors;
}

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

    throw new Error('TypeScript Benchmark Threshold Exceeded');
  }
}
