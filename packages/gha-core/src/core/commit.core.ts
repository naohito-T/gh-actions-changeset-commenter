import { GitHubContext, CustomArgs } from '../types';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export interface ICommitCore {
  /**
   * @description 対象のコミット一覧を取得する
   */
  fetchListCommit: (
    args: CustomArgs,
  ) => Promise<RestEndpointMethodTypes['repos']['listCommits']['response']>;
}

export class OctokitCommitCore implements ICommitCore {
  constructor(
    private readonly octokit: GitHubContext['octokit'],
    private readonly context: GitHubContext['context'],
  ) {}

  public fetchListCommit = async ({ ...args }: CustomArgs) => {
    return await this.octokit.rest.repos.listCommits({
      ...this.context.repo,
      ...args,
    });
  };
}
