import * as core from '@actions/core';
import { inspect } from 'util';
import {
  fetchPullRequest,
  fetchPullRequestList,
  GitHubContext,
  TargetPullRequestNumber,
  fetchListCommit,
  updatePullRequestMessage,
} from 'gha-core';
import { FromBranch, BaseBranch } from '../types';

/** @desc coreライブラリに接続するRepository */
export class ApiRepository {
  constructor(
    private readonly github: GitHubContext['github'],
    private readonly context: GitHubContext['context'],
  ) {}

  /** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
  fetchPRBodyMessage = async (
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
  fetchPendingPRs = async ({ base, per_page = 100 }: BaseBranch & { per_page?: number }) =>
    await fetchPullRequestList({
      github: this.github,
      context: this.context,
      base,
      state: 'open',
      per_page,
    });

  /** @desc 指定のbase branchに向いておりmergeされたPRsを取得する */
  fetchMergedPRs = async ({ base, per_page = 100 }: BaseBranch & { per_page?: number }) =>
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
  fetchMergedSelfPRs = async ({ prNumber }: TargetPullRequestNumber) => {
    return await fetchPullRequestList({
      github: this.github,
      context: this.context,
      pull_number: prNumber,
      state: 'closed',
      per_page: 100,
    });
  };

  /** @desc 対象のPR bodyをupdateする */
  updatePrMessage = async ({ prNumber, body }: TargetPullRequestNumber & { body: string[] }) => {
    await updatePullRequestMessage({
      github: this.github,
      context: this.context,
      prNumber,
      body: `${body.join('\n')}`,
    });
  };

  /** @desc base ← from: from merged not merge base */
  fetchPRsMergedInFromNotBase = async ({
    base,
    from,
  }: BaseBranch & FromBranch): Promise<string[]> => {
    /**
     * @desc developにマージされたがmainにはマージされていないプルリクエストのタイトルを取得
     * @note これにはマージされていないがクローズされたプルリクエストも含まれる
     */
    const fromMergedPRs = await fetchPullRequestList({
      github: this.github,
      context: this.context,
      base: from,
      state: 'closed',
      per_page: 100,
    });

    core.debug(`Inspect mergedPRsHtmlLinks${inspect(fromMergedPRs)}`);

    /**
     * @desc baseにmergeされたpull requestを取得する
     * @note これにはマージされていないがクローズされたプルリクエストも含まれる
     */
    const baseMergedPRs = await fetchPullRequestList({
      github: this.github,
      context: this.context,
      base,
      state: 'closed',
      per_page: 100,
    });

    core.debug(`Inspect baseMergedPRs${inspect(baseMergedPRs)}`);

    return fromMergedPRs.data
      .filter(
        (developPR) =>
          // マージされたもののみをチェック
          developPR.merged_at &&
          // mainにマージされていないものをチェック
          !baseMergedPRs.data.some(
            (mainPR) => mainPR.number === developPR.number && !mainPR.merged_at,
          ),
      )
      .map((pr) => pr._links.html.href);
  };

  /**
   * @desc 指定されたbaseブランチの最新マージコミットを取得する
   * @note shaにはdevelopなどのブランチ名でもよい
   * @note Merge pull request #29 hoge などの際sん1件を取得する
   */
  fetchLatestMergeCommit = async ({ base }: BaseBranch) => {
    const baseCommits = await fetchListCommit({
      github: this.github,
      context: this.context,
      sha: base,
      per_page: 100,
    });

    const latestMergeCommit = baseCommits.data.find((commit) =>
      commit.commit.message.startsWith('Merge'),
    );

    if (!latestMergeCommit) throw new Error(`Not ${base} Latest MergeCommit`);
    return latestMergeCommit;
  };
}

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
export const fetchPRBodyMessage = async ({
  github,
  context,
  prNumber,
}: GitHubContext & TargetPullRequestNumber): Promise<string | null> => {
  const pr = await fetchPullRequest({
    github,
    context,
    prNumber,
  });
  return pr.data.body;
};

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
export const fetchPendingPRsBaseTarget = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch) =>
  await fetchPullRequestList({ github, context, base, state: 'open' });

/**
 * @desc target branchにmerge済みのブランチタイトル一覧を取得する
 * @see https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28
 */
export const fetchMergedBasePRsTitle = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch): Promise<string[]> => {
  const response = await fetchPullRequestList({
    github,
    context,
    base,
    state: 'closed', // Only closed pull requests
    per_page: 100,
  });

  return response.data.filter((pr) => pr.merged_at).map((pr) => pr.title);
};

/** @desc 自身にmergeされたプルリクエストを取得する */
export const fetchMergedSelfPRs = async ({
  github,
  context,
  prNumber,
}: GitHubContext & TargetPullRequestNumber) => {
  return await fetchPullRequestList({
    github,
    context,
    pull_number: prNumber,
    state: 'closed',
    per_page: 100,
  });
};

/** @desc base ← from: from merged not merge base */
export const fetchPRsMergedInFromNotBase = async ({
  github,
  context,
  base,
  from,
}: GitHubContext & BaseBranch & FromBranch): Promise<string[]> => {
  /**
   * @desc developにマージされたがmainにはマージされていないプルリクエストのタイトルを取得
   * @note これにはマージされていないがクローズされたプルリクエストも含まれる
   */
  const fromMergedPRs = await fetchPullRequestList({
    github,
    context,
    base: from,
    state: 'closed',
    per_page: 100,
  });

  core.debug(`Inspect mergedPRsHtmlLinks${inspect(fromMergedPRs)}`);

  /**
   * @desc baseにmergeされたpull requestを取得する
   * @note これにはマージされていないがクローズされたプルリクエストも含まれる
   */
  const baseMergedPRs = await fetchPullRequestList({
    github,
    context,
    base,
    state: 'closed',
    per_page: 100,
  });

  core.debug(`Inspect baseMergedPRs${inspect(baseMergedPRs)}`);

  return fromMergedPRs.data
    .filter(
      (developPR) =>
        // マージされたもののみをチェック
        developPR.merged_at &&
        // mainにマージされていないものをチェック
        !baseMergedPRs.data.some(
          (mainPR) => mainPR.number === developPR.number && !mainPR.merged_at,
        ),
    )
    .map((pr) => pr._links.html.href);
};

/**
 * @desc 指定されたbaseブランチの最新マージコミットを取得する
 * @note shaにはdevelopなどのブランチ名でもよい
 * @note Merge pull request #29 hoge などの際sん1件を取得する
 */
export const fetchLatestMergeCommit = async ({ github, context, base }: GitHubContext & BaseBranch) => {
  const baseCommits = await fetchListCommit({
    github,
    context,
    sha: base,
    per_page: 100,
  });

  const latestMergeCommit = baseCommits.data.find((commit) =>
    commit.commit.message.startsWith('Merge'),
  );

  if (!latestMergeCommit) throw new Error(`Not ${base} Latest MergeCommit`);

  return latestMergeCommit;
};


