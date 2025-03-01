import {
  GitHubContext,
  TargetPullRequestNumber,
  UpdatePullRequestMessage,
  CustomArgs,
} from '../types';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export interface IPullRequestCore {
  /**
   * @desc プルリクエストを取得する
   */
  fetchPullRequest: (
    args: TargetPullRequestNumber & CustomArgs,
  ) => Promise<RestEndpointMethodTypes['pulls']['get']['response']>;
  /**
   * @desc baseに向いているプルリクエスト一覧を取得する
   */
  fetchPullRequestList: (
    args: { base?: string } & CustomArgs,
  ) => Promise<RestEndpointMethodTypes['pulls']['list']['response']>;
  /**
   * @desc プルリクエストにマージメッセージを反映させる
   */
  updatePullRequestMessage: (
    args: UpdatePullRequestMessage,
  ) => Promise<RestEndpointMethodTypes['pulls']['update']['response']>;
}

export class OctokitPullRequestCore implements IPullRequestCore {
  constructor(
    private readonly octokit: GitHubContext['octokit'],
    private readonly context: GitHubContext['context'],
  ) {}

  public fetchPullRequest = async ({
    prNumber,
    ...args // この部分が任意のオブジェクトを受け取るための変更
  }: TargetPullRequestNumber & CustomArgs) =>
    await this.octokit.rest.pulls.get({
      ...this.context.repo,
      pull_number: prNumber,
      ...args,
    });

  public fetchPullRequestList = async ({
    base,
    ...args // この部分が任意のオブジェクトを受け取るための変更
  }: { base?: string } & CustomArgs) =>
    await this.octokit.rest.pulls.list({
      ...this.context.repo, // owner && repo
      base, // PR target base branch
      ...args,
    });

  public updatePullRequestMessage = async ({ prNumber, body }: UpdatePullRequestMessage) =>
    await this.octokit.rest.pulls.update({
      ...this.context.repo,
      pull_number: prNumber,
      body,
    });
}
