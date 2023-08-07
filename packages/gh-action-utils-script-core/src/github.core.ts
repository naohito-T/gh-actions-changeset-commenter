import { GitHubContext, TargetPullRequestNumber, UpdatePullRequestMessage } from './type'

export const fetchPullRequests = async ({ github, context, prNumber }: GitHubContext & TargetPullRequestNumber ) => {
  return await github.rest.pulls.get({
    ...context.repo,
    pull_number: prNumber,
  });
}

// プルリクエストにマージメッセージを反映させる
export const updatePullRequestMessage = async ({ github, context, prNumber, body }: GitHubContext & UpdatePullRequestMessage) => {
  await github.rest.pulls.update({
      ...context.repo,
      pull_number: prNumber,
      body,
  });
}


