import * as core from '@actions/core';
import { GitHubContext, IncorrectError, updatePullRequestMessage } from 'gha-core';
import { fetchPRBodyMessage, fetchPRsMergedInFromNotBase } from '../repository';
import { BaseWithFromBranch } from '../types';

/** @desc pull_request eventの際に使用するusecase */
export const pullRequestUsecase = async ({
  github,
  context,
  base, // merge先
  from,
}: GitHubContext & BaseWithFromBranch) => {
  const prNumber = context.payload.pull_request?.number;
  if (!prNumber) throw new IncorrectError('Pull request number not found.');

  const fromBodyMessage = await fetchPRBodyMessage({ github, context, prNumber });
  const mergedPRsHtmlLinks = await fetchPRsMergedInFromNotBase({
    github,
    context,
    base, // merge先
    from,
  });

  if (mergedPRsHtmlLinks.length === 0) {
    core.warning('No PRs merged into develop but not into main.');
    return;
  }

  await updatePullRequestMessage({
    github,
    context,
    prNumber,
    body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
  });
};
