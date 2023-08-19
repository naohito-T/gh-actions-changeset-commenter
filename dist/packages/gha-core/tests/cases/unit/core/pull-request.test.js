"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../../../src/core");
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
    };
    const context = {
        repo: {
            owner: 'test-owner',
            repo: 'test-repo',
        },
    };
    it('fetchPullRequest パラメーターテスト', async () => {
        expect.assertions(1);
        const prNumber = 1;
        await (0, core_1.fetchPullRequest)({ github, context, prNumber });
        expect(mockedGithubRestRepos.get).toHaveBeenCalledWith({
            ...context.repo,
            pull_number: prNumber,
        });
    });
    it('fetchPullRequestList パラメーターテスト', async () => {
        expect.assertions(1);
        const base = 'test-base';
        await (0, core_1.fetchPullRequestList)({ github, context, base });
        expect(mockedGithubRestRepos.list).toHaveBeenCalledWith({
            ...context.repo,
            base,
        });
    });
    it('updatePullRequestMessage パラメーターテスト', async () => {
        expect.assertions(1);
        const prNumber = 1;
        const body = 'test-body';
        await (0, core_1.updatePullRequestMessage)({ github, context, prNumber, body });
        expect(mockedGithubRestRepos.update).toHaveBeenCalledWith({
            ...context.repo,
            pull_number: prNumber,
            body,
        });
    });
});
