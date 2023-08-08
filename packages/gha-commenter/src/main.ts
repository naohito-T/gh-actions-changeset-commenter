import * as core from '@actions/core';
import { fetchPullRequestList, updatePullRequestMessage } from 'gha-core';
import { GitHubContext } from 'gha-core/src/types';
import { fetchPendingBasePRs } from './commenter.usecase';
import { TargetBaseBranch } from './types';

/**
 * @desc main ブランチに今までコミットされたコミットメッセージを付与する
 * @note デバッグは｀github.log.debug｀シークレット `ACTIONS_STEP_DEBUG` をtrueに設定した場合のみ出力される
 */
export const main = async ({
  github,
  context,
  targetBranch = 'develop',
}: GitHubContext & { targetBranch: TargetBaseBranch }): Promise<void> => {
  try {
    // プルリクエストの情報を取得
    console.log(`start.`);
    console.log(`start. target branch ${targetBranch}`);
    const prNumber = context.payload.pull_request?.number;
    if (!prNumber) {
      throw new Error('Pull request number not found.');
    }

    console.log(`start.${prNumber}`);

    // const openPrsTargetingMain = await fetchPullRequestList({ github, context, base: 'main' });
    const prList = await fetchPendingBasePRs({ github, context, base: targetBranch });
    console.log(`start. pull request ${JSON.stringify(prList)}`);
    // const unmergedPrTitles = prList.data.filter(p => !p.merged_at).map(p => p.title);

    const mergeCommitTitle = prList.data.map((p) => p.title);

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
