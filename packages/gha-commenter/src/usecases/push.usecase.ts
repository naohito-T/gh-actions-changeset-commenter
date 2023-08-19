import * as core from '@actions/core';
import { GitHubContext, updateBranchBodyMessage } from 'gha-core';
import { fetchPRsMergedInFromNotBase } from '../repository';
import { BaseBranch } from '../types';

/** @desc push eventの際に使用するusecase */
export const pushUsecase = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch): Promise<void> => {
  const branchName = context.ref.replace('refs/heads/', '');

  const mergedPRsHtmlLinks = await fetchPRsMergedInFromNotBase({
    github,
    context,
    base, // merge先
    from: branchName,
  });

  if (mergedPRsHtmlLinks.length === 0) {
    core.warning('No PRs merged into develop but not into main.');
    return;
  }

  await updateBranchBodyMessage<`${typeof branchName}`>({
    github,
    context,
    branch: branchName,
    body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
  });
};
