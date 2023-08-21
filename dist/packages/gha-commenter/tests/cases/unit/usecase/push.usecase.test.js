"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gha_core_1 = require("gha-core");
const usecases_1 = require("../../../../src/usecases");
jest.mock('../../../../src/repository', () => ({
    fetchPRsMergedInFromNotBase: jest.fn().mockImplementation((args) => {
        if (args.context.eventName === 'push') {
            return ['mocked_link1', 'mocked_link2'];
        }
        return [];
    }),
}));
jest.mock('gha-core', () => ({
    updateBranchBodyMessage: jest.fn(),
}));
describe('push.usecase.ts', () => {
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
    it('baseとfromにmerge差分がない場合は処理が中断されるか', async () => {
        expect.assertions(1);
        const base = 'test-main-branch';
        const testContext = {
            ...context,
            ref: 'refs/heads/develop',
            eventName: 'pull_request',
        };
        await (0, usecases_1.pushUsecase)({ github, context: testContext, base });
        expect(gha_core_1.updateBranchBodyMessage).not.toHaveBeenCalled();
    });
    it('baseとfromにmerge差分がある場合はbody messageが作成されるか', async () => {
        expect.assertions(1);
        const base = 'test-main-branch';
        const testContext = {
            ...context,
            ref: 'refs/heads/develop',
            eventName: 'push',
        };
        await (0, usecases_1.pushUsecase)({ github, context: testContext, base });
        expect(gha_core_1.updateBranchBodyMessage).toHaveBeenCalledWith({
            github,
            context: testContext,
            branch: 'develop',
            body: '- mocked_link1\n- mocked_link2',
        });
    });
});
