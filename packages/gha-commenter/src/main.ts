import * as core from '@actions/core';
import { fetchPullRequest, fetchPullRequestList, updatePullRequestMessage } from 'gha-core';
import { GitHubContext } from 'gha-core/src/types';
// import { inspect } from 'util';

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

    const prList = await fetchPullRequestList({ github, context, prNumber });

    console.log(`start. pull request ${JSON.stringify(prList)}`);

    const mergeCommitTitle = prList.data.filter((p) => p.merge_commit_sha !== null).map((p) => p.title)

    console.log(`start.${mergeCommitTitle}`);

    const mergeTitleString = mergeCommitTitle.join('\n');

    // プルリクエストにマージメッセージを反映させる
    await updatePullRequestMessage({
      github,
      context,
      prNumber,
      body: `${mergeTitleString} test tanaka`,
    });

    console.log(`Merge message "${mergeTitleString}" has been applied to the pull request.`);
  } catch (e: unknown) {
    if (e instanceof Error) core.setFailed(e.message);
  }
};
