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
const main = async ({ github, context, base = 'develop', // merge先
from = 'develop', }) => {
    try {
        // 基底ブランチとプルリクエストで分ける必要があるかもしれない
        // 現在のプルリクを取得（developとする）怪しいかも
        const prNumber = context.payload.pull_request?.number;
        const branch = context.ref;
        console.log(`${JSON.stringify(context)}`);
        if (!prNumber)
            throw new Error('Pull request number not found.');
        console.log(`start. target branch ${base} target pull request${prNumber}`);
        // 現在のプルリクのbodyを取得する
        const fromBodyMessage = await (0, commenter_usecase_1.fetchPRBodyMessage)({ github, context, prNumber });
        const mergedPRsTitleList = await (0, commenter_usecase_1.fetchPRsMergedInFromNotBase)({
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
    }
    catch (e) {
        if (e instanceof Error)
            core.setFailed(e.message);
    }
};
exports.main = main;
