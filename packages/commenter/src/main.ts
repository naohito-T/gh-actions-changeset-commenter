import * as core from '@actions/core';
// import { GitHubContext } from '@/types'
import { fetchPullRequests, updatePullRequestMessage } from 'gh-action-utils-script-core'
// import { inspect } from 'util';

/**
 * @desc main ブランチに今までコミットされたコミットメッセージを付与する
 * @note デバッグは｀github.log.debug｀シークレット `ACTIONS_STEP_DEBUG` をtrueに設定した場合のみ出力される
 */
export const main = async ({ github, context }: any): Promise<void> => {
  try {
    // プルリクエストの情報を取得
    console.log(`start.`);
    const prNumber = context.payload.pull_request?.number;
    if (!prNumber) {
      throw new Error('Pull request number not found.');
    }

    console.log(`start.${prNumber}`);

    // プルリクエストの情報を取得してマージメッセージを取得
    const pr = await fetchPullRequests({ github, context, prNumber })

    console.log(`start. pull ${JSON.stringify(pr)}`);
    const mergeMessage = pr.data.title;

    console.log(`start.${mergeMessage}`);

    // await github.rest.pulls.update({
      //   ...context.repo,
      //   pull_number: prNumber,
      //   body: `${mergeMessage} test`,
      // });
      
    // プルリクエストにマージメッセージを反映させる
    await updatePullRequestMessage({ github, context, prNumber, body: `${mergeMessage} test tataatw`, } )

    console.log(`Merge message "${mergeMessage}" has been applied to the pull request.`);
  } catch (e: unknown) {
    if (e instanceof Error) core.setFailed(e.message);
  }
};
