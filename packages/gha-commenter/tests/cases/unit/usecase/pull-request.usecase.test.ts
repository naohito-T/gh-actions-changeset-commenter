import { updatePullRequestMessage, GitHubContext, IncorrectError } from 'gha-core';
import { pullRequestUsecase } from '../../../../src/usecases';

jest.mock('../../../../src/repository', () => ({
  fetchPRsMergedInFromNotBase: jest.fn().mockImplementation((args) => {
    if (args.context.payload.pull_request.number && args.context.eventName === 'pull_request') {
      return ['mocked_link1', 'mocked_link2'];
    }
    return [];
  }),
}));

jest.mock('gha-core', () => ({
  updatePullRequestMessage: jest.fn(),
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
    const from = 'test-develop-branch';

    const testContext = {
      ...context,
      payload: {
        pull_request: {},
      },
    } as unknown as GitHubContext['context'];

    await expect(
      pullRequestUsecase({ github, context: testContext, base, from }),
    ).rejects.toThrowError(IncorrectError);
  });

  it('baseとfromにmerge差分がない場合は処理が中断されるか', async () => {
    const base = 'test-main-branch';
    const from = 'test-develop-branch';

    const testContext = {
      ...context,
      payload: {
        pull_request: {
          number: 1,
        },
      },
      eventName: 'push',
    } as unknown as GitHubContext['context'];

    await pullRequestUsecase({ github, context: testContext, base, from });

    expect(updatePullRequestMessage).not.toHaveBeenCalled();
  });

  it('baseとfromにmerge差分がある場合はbody messageが作成されるか', async () => {
    expect.assertions(1);
    const base = 'test-main-branch';
    const from = 'test-develop-branch';

    const testContext = {
      ...context,
      payload: {
        pull_request: {
          number: 1,
        },
      },
      eventName: 'pull_request',
    } as unknown as GitHubContext['context'];

    await pullRequestUsecase({ github, context: testContext, base, from });

    expect(updatePullRequestMessage).toHaveBeenCalledWith({
      github,
      context: testContext,
      prNumber: 1,
      body: '- mocked_link1\n- mocked_link2',
    });
  });
});
