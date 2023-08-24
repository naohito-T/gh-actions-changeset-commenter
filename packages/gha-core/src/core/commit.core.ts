import { GitHubContext, CustomArgs } from '../types';

/** @desc 対象のコミット一覧を取得する */
export const fetchListCommit = async ({ github, context, ...args }: GitHubContext & CustomArgs) => {
  return await github.rest.repos.listCommits({
    ...context.repo,
    ...args,
  });
};
