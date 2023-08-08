import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

/** @desc GitHub CIコンテキストから注入されるコンテキスト */
export type GitHubContext = {
  github: InstanceType<typeof GitHub>;
  context: typeof context;
};

export type TargetPullRequestNumber = { prNumber: number };

export type UpdatePullRequestMessage = TargetPullRequestNumber & { body: string };
