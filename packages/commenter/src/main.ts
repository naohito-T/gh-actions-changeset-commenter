import * as core from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { wait } from './wait';
import { inspect } from 'util';

type GitHubContext = {
  github: InstanceType<typeof GitHub>;
  context: typeof context;
};

/**
 * @desc main ブランチに今までコミットされたコミットメッセージを付与する
 * @note デバッグは｀github.log.debug｀シークレット `ACTIONS_STEP_DEBUG` をtrueに設定した場合のみ出力される
 */
export const main = async ({ github, context }: GitHubContext): Promise<void> => {
  try {
    // プルリクエストの情報を取得
    console.log(`start.`);
    const prNumber = context.payload.pull_request?.number;
    if (!prNumber) {
      throw new Error('Pull request number not found.');
    }

    console.log(`start.${prNumber}`);

    // プルリクエストの情報を取得してマージメッセージを取得
    const pr = await github.rest.pulls.get({
      ...context.repo,
      pull_number: prNumber,
    });

    console.log(`start.${JSON.stringify(pr)}`);
    const mergeMessage = pr.data.title;

    console.log(`start.${mergeMessage}`);

    // プルリクエストにマージメッセージを反映させる
    await github.rest.pulls.update({
      ...context.repo,
      pull_number: prNumber,
      body: `${mergeMessage} test sample`,
    });

    console.log(`Merge message "${mergeMessage}" has been applied to the pull request.`);
  } catch (e: unknown) {
    if (e instanceof Error) core.setFailed(e.message);
  }
};
