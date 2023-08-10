"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullRequestUsecase = void 0;
const gha_core_1 = require("gha-core");
const repository_1 = require("../repository");
/**
 * @desc pull_request eventの際に使用するusecase
 */
const pullRequestUsecase = async ({ github, context, base = 'develop', // merge先
from = 'develop' }) => {
    // 基底ブランチとプルリクエストで分ける必要があるかもしれない
    // 現在のプルリクを取得（developとする）怪しいかも
    const prNumber = context.payload.pull_request?.number;
    console.log(`${JSON.stringify(context)}`);
    if (!prNumber)
        throw new Error('Pull request number not found.');
    console.log(`start. target branch ${base} target pull request${prNumber}`);
    // 現在のプルリクのbodyを取得する
    const fromBodyMessage = await (0, repository_1.fetchPRBodyMessage)({ github, context, prNumber });
    const mergedPRsTitleList = await (0, repository_1.fetchPRsMergedInFromNotBase)({
        github,
        context,
        base,
        from,
    });
    console.log(`start. pull request ${JSON.stringify(fromBodyMessage)}`);
    console.log(`start. pull request base ${JSON.stringify(mergedPRsTitleList)}`);
    if (mergedPRsTitleList.length === 0) {
        console.log('No PRs merged into develop but not into main.');
        return;
    }
    await (0, gha_core_1.updatePullRequestMessage)({
        github,
        context,
        prNumber,
        body: `${fromBodyMessage}\n${mergedPRsTitleList.join('\n')}`,
    });
};
exports.pullRequestUsecase = pullRequestUsecase;
