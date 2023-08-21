import { GitHubContext } from 'gha-core';
import {
  fetchPRBodyMessage,
  fetchPendingPRsBaseTarget,
  fetchMergedBasePRsTitle,
  fetchMergedSelfPRs,
  fetchPRsMergedInFromNotBase,
} from '../../../../src/repository';

const mockedGithubRestRepos = {
  get: jest.fn().mockReturnValue({ data: { body: 'mock' } }),
  list: jest.fn().mockReturnValue({
    data: [
      { merged_at: '2023/08/15', title: 'mock' },
      { merged_at: '2023/08/22', title: 'mock2' },
    ],
  }),
  getBranch: jest.fn().mockImplementation((args) => {
    if (args.context.eventName === 'push') {
      return ['mocked_link1', 'mocked_link2'];
    }
    return [];
  }),
  update: jest.fn(),
};

describe('api.repository.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('fetchPRBodyMessage', async () => {
    expect.assertions(2);
    const prNumber = 1;

    const txt = await fetchPRBodyMessage({ github, context, prNumber });

    expect(mockedGithubRestRepos.get).toHaveBeenCalledWith({
      ...context.repo,
      pull_number: prNumber,
    });
    expect(txt).toBe('mock');
  });

  it('fetchPendingPRsBaseTarget', async () => {
    expect.assertions(1);
    const base = 'test-main-branch';

    await fetchPendingPRsBaseTarget({ github, context, base });

    expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
      ...context.repo,
      base,
      state: 'open',
    });
  });

  it('fetchMergedBasePRsTitle', async () => {
    expect.assertions(2);
    const base = 'test-main-branch';

    const result = await fetchMergedBasePRsTitle({ github, context, base });

    expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
      ...context.repo,
      base,
      state: 'closed',
      per_page: 100,
    });

    expect(result).toStrictEqual(['mock', 'mock2']);
  });

  it('fetchMergedSelfPRs', async () => {
    expect.assertions(1);
    const prNumber = 1;

    await fetchMergedSelfPRs({ github, context, prNumber });

    expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
      ...context.repo,
      pull_number: prNumber,
      state: 'closed',
      per_page: 100,
    });
  });

  it('fetchPRsMergedInFromNotBase', async () => {
    expect.assertions(3);
    const base = 'test-main-branch';
    const from = 'test-from-branch';

    await fetchPRsMergedInFromNotBase({ github, context, base, from });

    expect(mockedGithubRestRepos.list).toHaveBeenCalledTimes(2);

    expect(mockedGithubRestRepos.list).toHaveBeenNthCalledWith(1, {
      ...context.repo,
      base: from,
      state: 'closed',
      per_page: 100,
    });

    expect(mockedGithubRestRepos.list).toHaveBeenNthCalledWith(2, {
      ...context.repo,
      base,
      state: 'closed',
      per_page: 100,
    });
  });
});
