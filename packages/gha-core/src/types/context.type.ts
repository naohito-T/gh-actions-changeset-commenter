import type { context } from '@actions/github';
import type { GitHub } from '@actions/github/lib/utils';

/**
 * @description GitHub CIコンテキストから注入されるコンテキスト
 */
export type GitHubContext = {
  octokit: InstanceType<typeof GitHub>;
  context: typeof context;
};
