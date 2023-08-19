import { fetchBranch, updateBranchBodyMessage } from '../../../../src/core';
import { GitHubContext } from '../../../../src/types';

const mockedGithubRestRepos = {
  getBranch: jest.fn(),
  update: jest.fn(),
};

describe('branch.core.ts', () => {
  const github = {
    rest: {
      repos: mockedGithubRestRepos,
    },
  } as unknown as GitHubContext['github'];

  const context = {
    repo: {
      owner: 'test-owner',
      repo: 'test-repo',
    },
  } as unknown as GitHubContext['context'];

  it('getBranchパラメーターテスト', async () => {
    expect.assertions(1);
    const branch = 'test-branch';

    await fetchBranch({ github, context, branch });

    expect(mockedGithubRestRepos.getBranch).toHaveBeenCalledWith({
      ...context.repo,
      branch,
    });
  });

  it('updateパラメーターテスト', async () => {
    expect.assertions(1);
    const branch = 'test-branch';
    const body = 'test-body';

    await updateBranchBodyMessage({ github, context, branch, body });

    expect(mockedGithubRestRepos.update).toHaveBeenCalledWith({
      ...context.repo,
      base: branch,
      body,
    });
  });
});
