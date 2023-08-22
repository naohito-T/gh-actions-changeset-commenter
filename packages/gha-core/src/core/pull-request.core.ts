import {
  GitHubContext,
  TargetPullRequestNumber,
  UpdatePullRequestMessage,
  CustomArgs,
} from '../types';

/** @desc プルリクエストを取得する */
export const fetchPullRequest = async ({
  github,
  context,
  prNumber,
  ...args // この部分が任意のオブジェクトを受け取るための変更
}: GitHubContext & TargetPullRequestNumber & CustomArgs) => {
  return await github.rest.pulls.get({
    ...context.repo,
    pull_number: prNumber,
    ...args,
  });
};

/** @desc baseに向いているプルリクエスト一覧を取得する */
export const fetchPullRequestList = async ({
  github,
  context,
  base,
  ...args // この部分が任意のオブジェクトを受け取るための変更
}: GitHubContext & { base?: string } & CustomArgs) => {
  return await github.rest.pulls.list({
    ...context.repo, // owner && repo
    base, // PR target base branch
    ...args,
  });
};

/** @desc fromに向いているプルリクをさガス */
// export const fetchFromPullRequestList = async ({
//   github,
//   context,
//   base,
//   ...args // この部分が任意のオブジェクトを受け取るための変更
// }: GitHubContext & { base?: string } & CustomArgs) => {
//   return await github.rest.pulls.list({
//     ...context.repo, // owner && repo
//     base, // PR target base branch
//     ...args,
//   });
// };

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
