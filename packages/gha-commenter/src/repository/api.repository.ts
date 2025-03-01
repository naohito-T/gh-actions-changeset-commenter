import { TargetPullRequestNumber, IBranchCore, IPullRequestCore, ICommitCore } from 'gha-core';
import { BaseBranch } from '../types';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

/**
 * @desc coreライブラリに接続するRepository
 */
export interface IGithubRepository {
  /**
   * @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する
   */
  fetchPRBodyMessage: (prNumber: TargetPullRequestNumber['prNumber']) => Promise<string | null>;
  /**
   * @desc 指定のbase branchに向いているOpen PRsを取得する
   */
  fetchPendingPRs: (
    args: BaseBranch & { per_page?: number },
  ) => Promise<RestEndpointMethodTypes['pulls']['list']['response']>;
  /**
   * @desc 指定のbase branchに向いておりmergeされたPRsを取得する
   */
  fetchMergedPRs: (
    args: BaseBranch & { per_page?: number },
  ) => Promise<RestEndpointMethodTypes['pulls']['list']['response']>;
  /**
   * @desc 自身にmergeされたプルリクエストを取得する
   */
  fetchMergedSelfPRs: (
    args: TargetPullRequestNumber,
  ) => Promise<RestEndpointMethodTypes['pulls']['list']['response']>;
  /**
   * @desc 対象のPR bodyをupdateする
   */
  updatePrMessage: (args: TargetPullRequestNumber & { body: string[] }) => Promise<void>;
  /**
   * @desc 指定されたbaseブランチの最新マージコミットを取得する
   * @note shaにはdevelopなどのブランチ名でもよい
   * @note Merge pull request #29 hoge などの際sん1件を取得する
   */
  fetchLatestMergeCommit: (
    args: BaseBranch,
  ) => Promise<RestEndpointMethodTypes['repos']['listCommits']['response']['data'][0]>;
}

export class GithubRepository implements IGithubRepository {
  constructor(
    private readonly branch: IBranchCore,
    private readonly pullRequest: IPullRequestCore,
    private readonly commit: ICommitCore,
  ) {}

  public fetchPRBodyMessage = async (
    prNumber: TargetPullRequestNumber['prNumber'],
  ): Promise<string | null> => {
    const pr = await this.pullRequest.fetchPullRequest({
      prNumber,
    });
    return pr.data.body;
  };

  public fetchPendingPRs = async ({ base, per_page = 100 }: BaseBranch & { per_page?: number }) =>
    await this.pullRequest.fetchPullRequestList({
      base,
      state: 'open',
      sort: 'updated', // 最新の更新順にソート
      direction: 'desc', // 降順
      per_page,
    });

  public fetchMergedPRs = async ({ base, per_page = 100 }: BaseBranch & { per_page?: number }) =>
    await this.pullRequest.fetchPullRequestList({
      base,
      state: 'closed',
      sort: 'updated', // 最新の更新順にソート
      direction: 'desc', // 降順
      per_page,
    });

  public fetchMergedSelfPRs = async ({ prNumber }: TargetPullRequestNumber) =>
    await this.pullRequest.fetchPullRequestList({
      pull_number: prNumber,
      state: 'closed',
      per_page: 100,
    });

  public updatePrMessage = async ({
    prNumber,
    body,
  }: TargetPullRequestNumber & { body: string[] }) => {
    await this.pullRequest.updatePullRequestMessage({
      prNumber,
      body: `${body.join('\n')}`,
    });
  };

  public fetchLatestMergeCommit = async ({ base }: BaseBranch) => {
    const baseCommits = await this.commit.fetchListCommit({
      sha: base,
      per_page: 10,
    });

    const latestMergeCommit = baseCommits.data.find((commit) =>
      commit.commit.message.startsWith('Merge'),
    );

    if (!latestMergeCommit) throw new Error(`Not ${base} Latest MergeCommit`);
    return latestMergeCommit;
  };
}
