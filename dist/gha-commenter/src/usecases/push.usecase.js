"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushUsecase = void 0;
const core_1 = require("gha-core/src/core");
const repository_1 = require("../repository");
/** @desc push eventの際に使用するusecase */
const pushUsecase = async ({ github, context, base = 'main', // merge先
 }) => {
    const branchName = context.ref.replace('refs/heads/', '');
    console.log(`${JSON.stringify(context)}`);
    const mergedPRsHtmlLinks = await (0, repository_1.fetchPRsMergedInFromNotBase)({
        github,
        context,
        base,
        from: branchName,
    });
    console.log(`start. pull request base ${JSON.stringify(mergedPRsHtmlLinks)}`);
    if (mergedPRsHtmlLinks.length === 0) {
        console.log('No PRs merged into develop but not into main.');
        return;
    }
    await (0, core_1.updateBranchBodyMessage)({
        github,
        context,
        branch: branchName,
        body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
    });
};
exports.pushUsecase = pushUsecase;
