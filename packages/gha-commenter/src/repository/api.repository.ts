import {
  fetchPullRequest,
  fetchPullRequestList,
  GitHubContext,
  TargetPullRequestNumber,
  fetchListCommit,
  updatePullRequestMessage,
} from 'gha-core';
import { BaseBranch } from '../types';

/** @desc coreライブラリに接続するRepository */
export class ApiRepository {
  constructor(
    private readonly github: GitHubContext['github'],
    private readonly context: GitHubContext['context'],
  ) {}

  /** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
  public fetchPRBodyMessage = async (
    prNumber: TargetPullRequestNumber['prNumber'],
  ): Promise<string | null> => {
    const pr = await fetchPullRequest({
      github: this.github,
      context: this.context,
      prNumber,
    });
    return pr.data.body;
  };

  /** @desc 指定のbase branchに向いているOpen PRsを取得する */
  public fetchPendingPRs = async ({ base, per_page = 100 }: BaseBranch & { per_page?: number }) =>
    await fetchPullRequestList({
      github: this.github,
      context: this.context,
      base,
      state: 'open',
      sort: 'updated', // 最新の更新順にソート
      direction: 'desc', // 降順
      per_page,
    });

  /** @desc 指定のbase branchに向いておりmergeされたPRsを取得する */
  public fetchMergedPRs = async ({ base, per_page = 100 }: BaseBranch & { per_page?: number }) =>
    await fetchPullRequestList({
      github: this.github,
      context: this.context,
      base,
      state: 'closed',
      sort: 'updated', // 最新の更新順にソート
      direction: 'desc', // 降順
      per_page,
    });

  /** @desc 自身にmergeされたプルリクエストを取得する */
  public fetchMergedSelfPRs = async ({ prNumber }: TargetPullRequestNumber) =>
    await fetchPullRequestList({
      github: this.github,
      context: this.context,
      pull_number: prNumber,
      state: 'closed',
      per_page: 100,
    });

  /** @desc 対象のPR bodyをupdateする */
  public updatePrMessage = async ({
    prNumber,
    body,
  }: TargetPullRequestNumber & { body: string[] }) => {
    await updatePullRequestMessage({
      github: this.github,
      context: this.context,
      prNumber,
      body: `${body.join('\n')}`,
    });
  };

  /**
   * @desc 指定されたbaseブランチの最新マージコミットを取得する
   * @note shaにはdevelopなどのブランチ名でもよい
   * @note Merge pull request #29 hoge などの際sん1件を取得する
   */
  public fetchLatestMergeCommit = async ({ base }: BaseBranch) => {
    const baseCommits = await fetchListCommit({
      github: this.github,
      context: this.context,
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
