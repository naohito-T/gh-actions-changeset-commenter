import * as core from '@actions/core';
import { GitHubContext, IncorrectError } from 'gha-core';
import { IGithubRepository } from '../repository';
import { BaseBranch } from '../types';

export class ChangeSetCommenterUseCase {
  constructor(
    private readonly context: GitHubContext['context'],
    private readonly repo: IGithubRepository,
  ) {}

  /**
   * @desc push eventの際に使用するusecase
   * 1. baseブランチの最新マージコミットを取得する
   * 2. from（自身）に向いていたclosedのプルリクエスト一覧を取得する
   * 3. baseに向いているプルリクエスト一覧から最新を取得
   * 4. fromにmergeされているプルリクでかつmergeの時間がbaseの最新mergeより未来のもの
   * */
  public pushUsecase = async ({ base }: BaseBranch): Promise<void> => {
    core.debug(`usecase, pushUsecase, base: ${base}`);
    const fromBranch = this.context.ref.replace('refs/heads/', '');
    core.debug(`usecase, pushUsecase, from_branch: ${fromBranch}`);

    const since = (await this.repo.fetchLatestMergeCommit({ base })).commit.committer?.date;

    if (!since) {
      core.warning(`usecase, pushUsecase, Not found. latest commit ${base}`);
      return;
    }

    const mergedFromPRs = await this.repo.fetchMergedPRs({ base: fromBranch });
    const latestBasePR = (await this.repo.fetchPendingPRs({ base, per_page: 10 })).data[0].number;

    core.debug(`usecase, pushUsecase, Update body pull_request number: ${latestBasePR}`);

    const mergedTopicPRs = mergedFromPRs.data
      .filter((pr) => pr.merged_at && new Date(pr.merged_at) > new Date(since))
      .map((d) => `- ${d.html_url}`);

    core.debug(`usecase, pushUsecase, mergedTopicPRs: ${mergedTopicPRs}`);
    await this.repo.updatePrMessage({ prNumber: latestBasePR, body: mergedTopicPRs });
  };

  /**
   * @desc pull_request eventの際に使用するusecase
   * 1. baseブランチの最新マージコミットを取得する
   * 2. from（自身）に向いていたclosedのプルリクエスト一覧を取得する
   * 3. baseに向いているプルリクエスト一覧から最新を取得
   * 4. fromにmergeされているプルリクでかつmergeの時間がbaseの最新mergeより未来のもの
   * */
  public pullRequestUsecase = async ({ base }: BaseBranch): Promise<void> => {
    const prNumber = this.context.payload.pull_request?.number;
    core.debug(`usecase, pullRequestUsecase, Update body pull_request number: ${prNumber}`);
    if (!prNumber) {
      core.warning(`usecase, pullRequestUsecase, Not found Pull request number ${prNumber}`);
      throw new IncorrectError('Pull request number not found.');
    }

    const fromBranch = this.context.ref.replace('refs/heads/', '');
    core.debug(`usecase, pullRequestUsecase, from_branch: ${fromBranch}`);

    const since = (await this.repo.fetchLatestMergeCommit({ base })).commit.committer?.date;
    if (!since) {
      core.warning(`usecase, pullRequestUsecase, Not found. latest commit ${base}`);
      return;
    }

    const mergedFromPRs = await this.repo.fetchMergedPRs({ base: fromBranch });
    const mergedTopicPRs = mergedFromPRs.data
      .filter((pr) => pr.merged_at && new Date(pr.merged_at) > new Date(since))
      .map((d) => `- ${d.html_url}`);
    core.debug(`usecase, pullRequestUsecase, mergedTopicPRs: ${mergedTopicPRs}`);

    await this.repo.updatePrMessage({ prNumber, body: mergedTopicPRs });
  };
}
