"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../../../../src/repository");
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
    };
    const context = {
        repo: {
            owner: 'test-owner',
            repo: 'test-repo',
        },
    };
    const r = new repository_1.ApiRepository(github, context);
    it('fetchPRBodyMessage', async () => {
        expect.assertions(2);
        const prNumber = 1;
        const txt = await r.fetchPRBodyMessage(prNumber);
        expect(mockedGithubRestRepos.get).toHaveBeenCalledWith({
            ...context.repo,
            pull_number: prNumber,
        });
        expect(txt).toBe('mock');
    });
    it('fetchPendingPRs', async () => {
        expect.assertions(2);
        const base = 'test-main-branch';
        const result = await r.fetchPendingPRs({ base });
        expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
            ...context.repo,
            base,
            state: 'open',
            sort: 'updated',
            direction: 'desc',
            per_page: 100,
        });
        expect(result.data).toStrictEqual([
            { merged_at: '2023/08/15', title: 'mock' },
            { merged_at: '2023/08/22', title: 'mock2' },
        ]);
    });
    it('fetchMergedPRs', async () => {
        expect.assertions(2);
        const base = 'test-main-branch';
        const result = await r.fetchMergedPRs({ base });
        expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
            ...context.repo,
            base,
            state: 'closed',
            sort: 'updated',
            direction: 'desc',
            per_page: 100,
        });
        expect(result.data).toStrictEqual([
            { merged_at: '2023/08/15', title: 'mock' },
            { merged_at: '2023/08/22', title: 'mock2' },
        ]);
    });
    it('fetchMergedSelfPRs', async () => {
        expect.assertions(1);
        const prNumber = 1;
        await r.fetchMergedSelfPRs({ prNumber });
        expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
            ...context.repo,
            pull_number: prNumber,
            state: 'closed',
            per_page: 100,
        });
    });
});
