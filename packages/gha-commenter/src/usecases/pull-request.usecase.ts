import { GitHubContext, updatePullRequestMessage } from 'gha-core';
import { fetchPRBodyMessage, fetchPRsMergedInFromNotBase } from '../repository';
import { CustomGitHubContext } from '../types';

/** @desc pull_request eventの際に使用するusecase */
export const pullRequestUsecase = async ({
  github,
  context,
  base = 'develop', // merge先
  from = 'develop',
}: GitHubContext & CustomGitHubContext) => {
  const prNumber = context.payload.pull_request?.number;
  if (!prNumber) throw new Error('Pull request number not found.');

  const fromBodyMessage = await fetchPRBodyMessage({ github, context, prNumber });
  const mergedPRsHtmlLinks = await fetchPRsMergedInFromNotBase({
    github,
    context,
    base, // merge先
    from,
  });

  console.log(`start. pull request ${JSON.stringify(fromBodyMessage)}`);
  console.log(`start. pull request base ${JSON.stringify(mergedPRsHtmlLinks)}`);

  if (mergedPRsHtmlLinks.length === 0) {
    console.log('No PRs merged into develop but not into main.');
    return;
  }

  await updatePullRequestMessage({
    github,
    context,
    prNumber,
    body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
  });
};
