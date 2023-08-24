"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gha_core_1 = require("gha-core");
const usecases_1 = require("../../../../src/usecases");
jest.mock('gha-core', () => ({
    fetch: jest.fn(),
}));
describe('pull-request.usecase.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const github = {};
    const context = {
        repo: {
            owner: 'test-owner',
            repo: 'test-repo',
        },
    };
    it('pull_requestが存在していない場合はエラーがスローされるか', async () => {
        expect.assertions(1);
        const base = 'test-main-branch';
        const testContext = {
            ...context,
            payload: {
                pull_request: {},
            },
        };
        await expect((0, usecases_1.pullRequestUsecase)({ github, context: testContext, base })).rejects.toThrowError(gha_core_1.IncorrectError);
    });
});
