import { GitHubContext, TargetPullRequestNumber, UpdatePullRequestMessage } from './types';

/** @desc プルリクエストを取得する */
export const fetchPullRequest = async ({
  github,
  context,
  prNumber,
}: GitHubContext & TargetPullRequestNumber) => {
  return await github.rest.pulls.get({
    ...context.repo,
    pull_number: prNumber,
  });
};

/** @desc プルリクエスト一覧を取得する */
export const fetchPullRequestList = async ({
  github,
  context,
  base,
}: GitHubContext & { base?: string }) => {
  return await github.rest.pulls.list({
    ...context.repo, // owner && repo
    base, // PR target base branch
  });
};

/** @desc merge一覧を取得する */
// export const fetchMergeBranchList = async ({ github, context, prNumber }: GitHubContext & TargetPullRequestNumber ) => {
//   return await github.rest.pulls.merge({
//     ...context.repo,
//     pull_number: prNumber,
//   });
// }

/** @desc プルリクエストにマージメッセージを反映させる */
export const updatePullRequestMessage = async ({
  github,
  context,
  prNumber,
  body,
}: GitHubContext & UpdatePullRequestMessage) => {
  await github.rest.pulls.update({
    ...context.repo,
    pull_number: prNumber,
    body,
  });
};
