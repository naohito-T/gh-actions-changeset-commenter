"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const core = __importStar(require("@actions/core"));
const gha_core_1 = require("gha-core");
const commenter_usecase_1 = require("./commenter.usecase");
/**
 * @desc main ブランチに今までコミットされたコミットメッセージを付与する
 * @note デバッグは｀github.log.debug｀シークレット `ACTIONS_STEP_DEBUG` をtrueに設定した場合のみ出力される
 */
const main = async ({ github, context, targetBranch = 'develop', }) => {
    try {
        // プルリクエストの情報を取得
        console.log(`start.`);
        console.log(`start. target branch ${targetBranch}`);
        const prNumber = context.payload.pull_request?.number;
        if (!prNumber) {
            throw new Error('Pull request number not found.');
        }
        console.log(`start.${prNumber}`);
        // const openPrsTargetingMain = await fetchPullRequestList({ github, context, base: 'main' });
        const prList = await (0, commenter_usecase_1.fetchPendingBasePRs)({ github, context, base: targetBranch });
        console.log(`start. pull request ${JSON.stringify(prList)}`);
        // const unmergedPrTitles = prList.data.filter(p => !p.merged_at).map(p => p.title);
        const mergeCommitTitle = prList.data.map((p) => p.title);
        console.log(`start.${mergeCommitTitle}`);
        const mergeTitleString = mergeCommitTitle.join('\n');
        // プルリクエストにマージメッセージを反映させる
        await (0, gha_core_1.updatePullRequestMessage)({
            github,
            context,
            prNumber,
            body: `${mergeTitleString} test tanaka`,
        });
        console.log(`Merge message "${mergeTitleString}" has been applied to the pull request.`);
    }
    catch (e) {
        if (e instanceof Error)
            core.setFailed(e.message);
    }
};
exports.main = main;
