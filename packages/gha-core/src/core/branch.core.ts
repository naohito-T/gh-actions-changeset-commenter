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
 * @deprecated 403で対応ができない
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
