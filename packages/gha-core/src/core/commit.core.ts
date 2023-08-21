import { GitHubContext, CustomArgs } from '../types';

/** @desc 対象のコミット一覧を取得する */
export const fetchListCommit = async ({
  github,
  context,
  ...args // この部分が任意のオブジェクトを受け取るための変更
}: GitHubContext & CustomArgs) => {
  return await github.rest.repos.listCommits({
    ...context.repo,
    // sha: mainBranch,
    ...args,
  });
};
