import { execa } from 'execa';

/**
 * Kills the given process (equivalent of sending CTRL-C)
 * @param processInstance an instance of execa child process
 */
export const killExecaProcess = async (processInstance: any) => {
  if (process.platform.startsWith('win')) {
    if (typeof processInstance.pid !== 'number') {
      throw new Error('Cannot kill the process that does not have pid');
    }
    // Wait X milliseconds before sending kill in hopes of draining the node event queue
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // // eslint-disable-next-line spellcheck/spell-checker
    await execa('taskkill', ['/pid', `${processInstance.pid}`, '/f', '/t']);
  } else {
    processInstance.kill('SIGINT');
  }
};
