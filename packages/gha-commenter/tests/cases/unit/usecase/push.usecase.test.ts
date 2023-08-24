describe('sample', () => {
  it('', () => {});
});
// jest.mock('../../../../src/repository', () => ({
//   fetchPRsMergedInFromNotBase: jest.fn().mockImplementation((args) => {
//     if (args.context.eventName === 'push') {
//       return ['mocked_link1', 'mocked_link2'];
//     }
//     return [];
//   }),
//   fetchLatestMergeCommit: jest.fn().mockImplementation((args) => {
//     if (args.context.eventName === 'push') {
//       return ['mocked_link1', 'mocked_link2'];
//     }
//     return [];
//   }),
// }));

// jest.mock('gha-core', () => ({
//   updateBranchBodyMessage: jest.fn(),
// }));

// describe('push.usecase.ts', () => {
// beforeEach(() => {
//   jest.clearAllMocks();
// });
// const github = {} as unknown as GitHubContext['github'];
// const context = {
//   repo: {
//     owner: 'test-owner',
//     repo: 'test-repo',
//   },
// } as unknown as GitHubContext['context'];
// it('baseとfromにmerge差分がない場合は処理が中断されるか', async () => {
//   expect.assertions(1);
//   const base = 'test-main-branch';
//   const testContext = {
//     ...context,
//     ref: 'refs/heads/develop',
//     eventName: 'pull_request',
//   } as unknown as GitHubContext['context'];
//   await pushUsecase({ github, context: testContext, base });
//   expect(updateBranchBodyMessage).not.toHaveBeenCalled();
// });
// it('baseとfromにmerge差分がある場合はbody messageが作成されるか', async () => {
//   expect.assertions(1);
//   const base = 'test-main-branch';
//   const testContext = {
//     ...context,
//     ref: 'refs/heads/develop',
//     eventName: 'push',
//   } as unknown as GitHubContext['context'];
//   await pushUsecase({ github, context: testContext, base });
//   expect(updateBranchBodyMessage).toHaveBeenCalledWith({
//     github,
//     context: testContext,
//     branch: 'develop',
//     body: '- mocked_link1\n- mocked_link2',
//   });
// });
// });
