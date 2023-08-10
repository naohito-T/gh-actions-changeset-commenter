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
exports.pullRequestUsecase = void 0;
const core = __importStar(require("@actions/core"));
const gha_core_1 = require("gha-core");
const repository_1 = require("../repository");
/** @desc pull_request eventの際に使用するusecase */
const pullRequestUsecase = async ({ github, context, base, // merge先
from, }) => {
    const prNumber = context.payload.pull_request?.number;
    if (!prNumber)
        throw new gha_core_1.IncorrectError('Pull request number not found.');
    const fromBodyMessage = await (0, repository_1.fetchPRBodyMessage)({ github, context, prNumber });
    const mergedPRsHtmlLinks = await (0, repository_1.fetchPRsMergedInFromNotBase)({
        github,
        context,
        base,
        from,
    });
    if (mergedPRsHtmlLinks.length === 0) {
        core.warning('No PRs merged into develop but not into main.');
        return;
    }
    await (0, gha_core_1.updatePullRequestMessage)({
        github,
        context,
        prNumber,
        body: `${mergedPRsHtmlLinks.map((href) => `- ${href}`).join('\n')}`,
    });
};
exports.pullRequestUsecase = pullRequestUsecase;
