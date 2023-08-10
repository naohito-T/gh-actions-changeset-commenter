"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullRequestUsecase = void 0;
const core_1 = require("gha-core/src/core");
const repository_1 = require("../repository");
/** @desc pull_request eventの際に使用するusecase */
const pullRequestUsecase = async ({ github, context, base = 'develop', // merge先
from = 'develop', }) => {
    const prNumber = context.payload.pull_request?.number;
    console.log(`${JSON.stringify(context)}`);
    if (!prNumber)
        throw new Error('Pull request number not found.');
    const fromBodyMessage = await (0, repository_1.fetchPRBodyMessage)({ github, context, prNumber });
    const mergedPRsHtmlLinks = await (0, repository_1.fetchPRsMergedInFromNotBase)({
        github,
        context,
        base,
        from,
    });
    console.log(`start. pull request ${JSON.stringify(fromBodyMessage)}`);
    console.log(`start. pull request base ${JSON.stringify(mergedPRsHtmlLinks)}`);
    if (mergedPRsHtmlLinks.length === 0) {
        console.log('No PRs merged into develop but not into main.');
        return;
    }
    await (0, core_1.updatePullRequestMessage)({
        github,
        context,
        prNumber,
        body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
    });
};
exports.pullRequestUsecase = pullRequestUsecase;
