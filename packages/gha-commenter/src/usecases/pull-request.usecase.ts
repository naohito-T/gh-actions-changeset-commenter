import * as core from '@actions/core';
import { GitHubContext, IncorrectError } from 'gha-core';
import { ApiRepository } from '../repository';
import { BaseBranch } from '../types';

/**
 * @desc pull_request eventの際に使用するusecase
 * 1. baseブランチの最新マージコミットを取得する
 * 2. from（自身）に向いていたclosedのプルリクエスト一覧を取得する
 * 3. baseに向いているプルリクエスト一覧から最新を取得
 * 4. fromにmergeされているプルリクでかつmergeの時間がbaseの最新mergeより未来のもの
 * */
export const pullRequestUsecase = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch): Promise<void> => {
  const prNumber = context.payload.pull_request?.number;
  if (!prNumber) throw new IncorrectError('Pull request number not found.');

  const r = new ApiRepository(github, context);
  const fromBranch = context.ref.replace('refs/heads/', '');

  core.debug(`from_branch: ${fromBranch}`);
  core.debug(`Update body pull_request number: ${prNumber}`);

  const since = (await r.fetchLatestMergeCommit({ base })).commit.committer?.date;

  if (!since) {
    core.warning(`Not found. latest commit ${base}`);
    return;
  }

  const mergedFromPRs = await r.fetchMergedPRs({ base: fromBranch });

  const mergedTopicPRs = mergedFromPRs.data
    .filter((pr) => pr.merged_at && new Date(pr.merged_at) > new Date(since))
    .map((d) => `- ${d.html_url}`);

  await r.updatePrMessage({ prNumber, body: mergedTopicPRs });
};
