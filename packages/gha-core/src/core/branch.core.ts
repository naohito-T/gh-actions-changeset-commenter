import { GitHubContext, RefBranch, UpdateBranchBodyMessage, CustomArgs } from '../types';

/** @desc branchを取得する */
export const fetchBranch = async <T extends string>({
  github,
  context,
  branch,
  ...args // この部分が任意のオブジェクトを受け取るための変更
}: GitHubContext & RefBranch<T> & CustomArgs) =>
  await github.rest.repos.getBranch({
    ...context.repo,
    branch,
    ...args,
  });

/**
 * @desc ブランチにマージメッセージを反映させる
 * @deprecated 基底ブランチに対しての更新は403で弾かれるため非推奨
 */
export const updateBranchBodyMessage = async <T extends string>({
  github,
  context,
  branch,
  body,
}: GitHubContext & UpdateBranchBodyMessage<T>) => {
  await github.rest.repos.update({
    ...context.repo,
    base: branch,
    body,
  });
};


// export const updateBranchBodyMessage2 = async <T extends string>({
//   github,
//   context,
//   branch,
//   body,
// }: GitHubContext & UpdateBranchBodyMessage<T>) => {
//   await github.rest.repos.updateCommitComment({
//     ...context.repo,
//     comment_id: context.sha,
//     body,
//   });
// };
