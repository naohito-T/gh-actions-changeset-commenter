import {
  fetchPullRequest,
  fetchPullRequestList,
  updatePullRequestMessage,
} from '../../../../src/core';
import { GitHubContext } from '../../../../src/types';

const mockedGithubRestRepos = {
  get: jest.fn(),
  list: jest.fn(),
  update: jest.fn(),
};

describe('pull-request.core.ts', () => {
  const github = {
    rest: {
      pulls: mockedGithubRestRepos,
    },
  } as unknown as GitHubContext['github'];

  const context = {
    repo: {
      owner: 'test-owner',
      repo: 'test-repo',
    },
  } as unknown as GitHubContext['context'];

  it('fetchPullRequest パラメーターテスト', async () => {
    expect.assertions(1);
    const prNumber = 1;

    await fetchPullRequest({ github, context, prNumber });

    expect(mockedGithubRestRepos.get).toHaveBeenCalledWith({
      ...context.repo,
      pull_number: prNumber,
    });
  });

  it('fetchPullRequestList パラメーターテスト', async () => {
    expect.assertions(1);
    const base = 'test-base';

    await fetchPullRequestList({ github, context, base });

    expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
      ...context.repo,
      base,
    });
  });

  it('updatePullRequestMessage パラメーターテスト', async () => {
    expect.assertions(1);
    const prNumber = 1;
    const body = 'test-body';

    await updatePullRequestMessage({ github, context, prNumber, body });

    expect(mockedGithubRestRepos.update).toHaveBeenCalledWith({
      ...context.repo,
      pull_number: prNumber,
      body,
    });
  });
});
