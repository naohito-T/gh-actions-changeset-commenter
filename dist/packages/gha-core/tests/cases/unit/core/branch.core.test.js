"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../../../src/core");
const mockedGithubRestRepos = {
    getBranch: jest.fn(),
    update: jest.fn(),
};
describe('branch.core.ts', () => {
    const github = {
        rest: {
            repos: mockedGithubRestRepos,
        },
    };
    const context = {
        repo: {
            owner: 'test-owner',
            repo: 'test-repo',
        },
    };
    it('getBranchパラメーターテスト', async () => {
        expect.assertions(1);
        const branch = 'test-branch';
        await (0, core_1.fetchBranch)({ github, context, branch });
        expect(mockedGithubRestRepos.getBranch).toHaveBeenCalledWith({
            ...context.repo,
            branch,
        });
    });
    it('updateパラメーターテスト', async () => {
        expect.assertions(1);
        const branch = 'test-branch';
        const body = 'test-body';
        await (0, core_1.updateBranchBodyMessage)({ github, context, branch, body });
        expect(mockedGithubRestRepos.update).toHaveBeenCalledWith({
            ...context.repo,
            base: branch,
            body,
        });
    });
});
