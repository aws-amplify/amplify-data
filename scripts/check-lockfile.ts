import { LockFileValidator } from './components/lockfile-validator.js';

try {
  await new LockFileValidator('yarn.lock', '.yarnrc.yml').validate();
  console.log('yarn.lock and .yarnrc.yml passed lockfile validation.');
} catch (e) {
  console.error((e as Error).message);
  process.exitCode = 1;
}
