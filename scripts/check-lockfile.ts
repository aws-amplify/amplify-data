import { LockFileValidator } from './components/lockfile-validator.js';

(async () => await new LockFileValidator('yarn.lock').validate())();
