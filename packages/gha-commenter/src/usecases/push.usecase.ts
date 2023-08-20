import * as core from '@actions/core';
import { inspect } from 'util';
import { GitHubContext, fetchBranch, updateBranchBodyMessage } from 'gha-core';
import { fetchPRsMergedInFromNotBase } from '../repository';
import { BaseBranch } from '../types';

/** @desc push eventの際に使用するusecase */
export const pushUsecase = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch): Promise<void> => {
  console.log(`context ${JSON.stringify(context)}`);
  const branchName = context.ref.replace('refs/heads/', '');

  core.debug(`branch: ${branchName}`);

  const mergedPRsHtmlLinks = await fetchPRsMergedInFromNotBase({
    github,
    context,
    base, // merge先
    from: branchName,
  });

  core.info(`HTML Links length${mergedPRsHtmlLinks.length}`);
  core.debug(`HTML Links${inspect(mergedPRsHtmlLinks)}`);

  if (mergedPRsHtmlLinks.length === 0) {
    core.warning('No PRs merged into develop but not into main.');
    return;
  }

  const targetBranch = await fetchBranch({
    github,
    context,
    branch: branchName,
  });

  console.log(`target Branch${JSON.stringify(targetBranch)}`);

  await updateBranchBodyMessage<`${typeof branchName}`>({
    github,
    context,
    branch: branchName,
    body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
  });
};
