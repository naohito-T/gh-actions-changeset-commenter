import { GitHubContext, IncorrectError } from 'gha-core';
import { pullRequestUsecase } from '../../../../src/usecases';

jest.mock('gha-core', () => ({
  fetch: jest.fn(),
}));

describe('pull-request.usecase.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const github = {} as unknown as GitHubContext['github'];

  const context = {
    repo: {
      owner: 'test-owner',
      repo: 'test-repo',
    },
  } as unknown as GitHubContext['context'];

  it('pull_requestが存在していない場合はエラーがスローされるか', async () => {
    expect.assertions(1);
    const base = 'test-main-branch';

    const testContext = {
      ...context,
      payload: {
        pull_request: {},
      },
    } as unknown as GitHubContext['context'];

    await expect(pullRequestUsecase({ github, context: testContext, base })).rejects.toThrowError(
      IncorrectError,
    );
  });
});
