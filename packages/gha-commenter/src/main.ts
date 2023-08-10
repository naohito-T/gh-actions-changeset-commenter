import * as core from '@actions/core';
import { GitHubContext, errorHandler } from 'gha-core/src';
import { pullRequestUsecase, pushUsecase } from './usecases';
import { CustomGitHubContext } from './types';

/**
 * @desc main ブランチに今までコミットされたコミットメッセージを付与する
 * @note デバッグは｀github.log.debug｀シークレット `ACTIONS_STEP_DEBUG` をtrueに設定した場合のみ出力される
 */
export const main = async ({
  github,
  context,
  base = 'develop', // merge先
  from = 'develop',
}: GitHubContext & CustomGitHubContext): Promise<void> => {
  try {
    console.log(`start context: ${JSON.stringify(context)}`);
    let body: string;
    switch (context.eventName) {
      case 'push':
        await pushUsecase({ github, context, base });
      case 'pull_request':
        await pullRequestUsecase({ github, context, base, from });
        break;
      default:
        throw new Error('This event is not supported.');
    }
  } catch (e: unknown) {
    const { message } = errorHandler(e);
    message
      ? core.setFailed(message)
      : // 差分がないとき
        core.error('No PRs merged into ${} but not into ${}.');
  }
};
