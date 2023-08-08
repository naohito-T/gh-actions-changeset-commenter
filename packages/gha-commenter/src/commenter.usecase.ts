import { fetchPullRequestList } from 'gha-core';
import { GitHubContext } from 'gha-core/src/types';
import { TargetBaseBranch } from './types';

/** @desc PRでtargetが指定のbase branchに向いている一覧を取得する */
export const fetchPendingBasePRs = async ({
  github,
  context,
  base,
}: GitHubContext & { base: TargetBaseBranch }) =>
  await fetchPullRequestList({ github, context, base });
