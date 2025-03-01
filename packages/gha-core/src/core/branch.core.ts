import { GitHubContext, RefBranch, UpdateBranchBodyMessage, CustomArgs } from '../types';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export interface IBranchCore {
  /**
   * @desc branchを取得する
   */
  fetchBranch: <T extends string>(
    args: RefBranch<T> & CustomArgs,
  ) => Promise<RestEndpointMethodTypes['repos']['getBranch']['response']>;
  /**
   * @desc ブランチにマージメッセージを反映させる
   * @deprecated 基底ブランチに対しての更新は403で弾かれるため非推奨
   */
  updateBranchBodyMessage: <T extends string>(args: UpdateBranchBodyMessage<T>) => Promise<void>;
}

export class OctokitBranchCore implements IBranchCore {
  constructor(
    private readonly octokit: GitHubContext['octokit'],
    private readonly context: GitHubContext['context'],
  ) {}

  public fetchBranch = async <T extends string>({
    branch,
    ...args // この部分が任意のオブジェクトを受け取るための変更
  }: RefBranch<T> & CustomArgs) =>
    await this.octokit.rest.repos.getBranch({
      ...this.context.repo,
      branch,
      ...args,
    });

  public updateBranchBodyMessage = async <T extends string>({
    branch,
    body,
  }: UpdateBranchBodyMessage<T>): Promise<void> => {
    await this.octokit.rest.repos.update({
      ...this.context.repo,
      base: branch,
      body,
    });
  };
}
