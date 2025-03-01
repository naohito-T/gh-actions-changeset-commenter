import { GithubRepository } from '../repository';
import { ChangeSetCommenterUseCase } from '../usecases';
import {
  GitHubContext,
  OctokitBranchCore,
  OctokitPullRequestCore,
  OctokitCommitCore,
} from 'gha-core';

export const container = (octokit: GitHubContext['octokit'], context: GitHubContext['context']) =>
  new ChangeSetCommenterUseCase(
    context,
    new GithubRepository(
      new OctokitBranchCore(octokit, context),
      new OctokitPullRequestCore(octokit, context),
      new OctokitCommitCore(octokit, context),
    ),
  );
