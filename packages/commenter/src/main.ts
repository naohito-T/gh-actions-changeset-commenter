import * as core from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { wait } from './wait';

type GitHubContext = {
  github: InstanceType<typeof GitHub>;
  context: typeof context;
};

export const main = async ({ github, context }: GitHubContext): Promise<void> => {
  try {
    console.log('github ggg', github);
    console.log('context ggg', context);
    const msString: string = core.getInput('milliseconds') || '1';
    console.log('gitlog', github.log.debug(`Waiting ${msString} milliseconds ...`)); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const ms: number = parseInt(msString, 10);

    if (isNaN(ms)) {
      throw new Error('milliseconds not a number');
    }

    console.log('gitlog2', github.log.debug(new Date().toTimeString()));
    await wait(ms);
    console.log('gitlog3', github.log.debug(new Date().toTimeString()));

    console.log(core.setOutput('timesssssssssssss', new Date().toTimeString()));
  } catch (e: unknown) {
    if (e instanceof Error) core.setFailed(e.message);
  }
};
