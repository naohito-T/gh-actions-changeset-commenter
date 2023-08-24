import * as core from '@actions/core';
import { GitHubContext, IncorrectError, errorHandler } from 'gha-core';
import { pullRequestUsecase, pushUsecase } from './usecases';
import { CustomGitHubContext } from './types';

/** @desc Pull Requestに対してbase ← fromの差分のPull Requestタイトルを反映する */
export const main = async ({
  github,
  context,
  base, // merge先
  from, // merge元
}: GitHubContext & CustomGitHubContext): Promise<void> => {
  try {
    switch (context.eventName) {
      case 'push':
        if (!base) throw new IncorrectError(`Missing parameters ${base}: Please README`);
        await pushUsecase({ github, context, base });
        break;
      case 'pull_request':
        if (!base || !from)
          throw new IncorrectError(`Missing parameters ${base} or ${from} Please README`);
        await pullRequestUsecase({ github, context, base, from });
        break;
      default:
        throw new IncorrectError('This event is not supported.');
    }

    core.setOutput('result', ``);
  } catch (e: unknown) {
    const { message } = errorHandler(e);
    core.setFailed(message);
  }
};
