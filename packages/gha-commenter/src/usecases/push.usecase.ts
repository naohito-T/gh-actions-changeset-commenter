import * as core from '@actions/core';
import { inspect } from 'util';
import { GitHubContext, fetchPullRequestList, updatePullRequestMessage } from 'gha-core';
import { getLatestCommit } from '../repository';
import { BaseBranch } from '../types';

/** @desc push eventの際に使用するusecase */
// export const pushUsecase = async ({
//   github,
//   context,
//   base,
// }: GitHubContext & BaseBranch): Promise<void> => {
//   core.debug(`context ${inspect(context)}`);

//   const branchName = context.ref.replace('refs/heads/', '');
//   core.debug(`branch: ${branchName}`);

//   const mergedPRsHtmlLinks = await fetchPRsMergedInFromNotBase({
//     github,
//     context,
//     base, // merge先
//     from: branchName,
//   });

//   core.info(`HTML Links length: ${mergedPRsHtmlLinks.length}`);
//   core.debug(`HTML Links${inspect(mergedPRsHtmlLinks)}`);

//   if (mergedPRsHtmlLinks.length === 0) {
//     core.warning('No PRs merged into develop but not into main.');
//     return;
//   }

//   // baseに向いているプルリクエスト一覧を取得する
//   const targetBranch = await fetchPullRequestList({
//     github,
//     context,
//     base,
//   });

//   console.log(`target Branch${JSON.stringify(targetBranch)}`);

//   const prn = targetBranch.data[0].number;

//   await updatePullRequestMessage({
//     github,
//     context,
//     prNumber: prn,
//     body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
//   });
// };

export const pushUsecase = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch): Promise<void> => {
  core.debug(`context ${inspect(context)}`);

  const fromBranch = context.ref.replace('refs/heads/', '');
  core.debug(`branch: ${fromBranch}`);

  const latestMergeCommit = await getLatestCommit({ github, context, base });
  const since = latestMergeCommit?.commit?.committer?.date;

  if (!since) {
    core.warning('No PRs merged into develop but not into main.');
    return;
  }

  // baseに向いているプルリクエスト一覧を取得する
  const mergedBasePRs = await fetchPullRequestList({
    github,
    context,
    base: fromBranch,
    state: 'closed',
    sort: 'updated',
    direction: 'desc',
    per_page: 100,
  });

  const prn = mergedBasePRs.data[0].number;
  const mergedTopicPRs = mergedBasePRs.data.filter(
    (pr) => pr.merged_at && new Date(pr.merged_at) > new Date(since),
  );
  await updatePullRequestMessage({
    github,
    context,
    prNumber: prn,
    body: `${mergedTopicPRs.map((href) => `- ${href}`).join('\n')}`,
  });
};