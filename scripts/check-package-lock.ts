import { PackageLockValidator } from './components/package-lock-validator.js';

(async () => await new PackageLockValidator('package-lock.json').validate())();
