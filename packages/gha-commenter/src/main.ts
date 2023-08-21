import * as core from '@actions/core';
import { GitHubContext, IncorrectError, errorHandler } from 'gha-core';
import { pullRequestUsecase, pushUsecase } from './usecases';
import { CustomGitHubContext } from './types';

/**
 * @desc main ブランチに今までコミットされたコミットメッセージを付与する
 * @note デバッグは｀github.log.debug｀シークレット `ACTIONS_STEP_DEBUG` をtrueに設定した場合のみ出力される
 */
export const main = async ({
  github,
  context,
  base, // merge先
  from, // merge元
}: GitHubContext & CustomGitHubContext): Promise<void> => {
  try {
    switch (context.eventName) {
      case 'push':
        if (!base) throw new IncorrectError(`Missing parameters ${base}`);
        await pushUsecase({ github, context, base });
        break;
      case 'pull_request':
        if (!base || !from) throw new IncorrectError(`Missing parameters ${base} or ${from}`);
        await pullRequestUsecase({ github, context, base, from });
        break;
      default:
        throw new IncorrectError('This event is not supported.');
    }

    core.setOutput('comment-id', 'actions');
  } catch (e: unknown) {
    const { message } = errorHandler(e);
    core.setFailed(message);
  }
};
