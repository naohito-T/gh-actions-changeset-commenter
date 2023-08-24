import * as core from '@actions/core';
import { GitHubContext, IncorrectError, errorHandler } from 'gha-core';
import { pullRequestUsecase, pushUsecase } from './usecases';
import { CustomGitHubContext } from './types';

/** @desc Pull Requestに対してbase ← fromの差分のPull Requestタイトルを反映する */
export const main = async ({
  github,
  context,
  base, // merge先
}: GitHubContext & CustomGitHubContext): Promise<void> => {
  try {
    if (!base) throw new IncorrectError(`Missing parameters ${base}: Please README`);
    switch (context.eventName) {
      case 'push':
        await pushUsecase({ github, context, base });
        break;
      case 'pull_request':
        await pullRequestUsecase({ github, context, base });
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
