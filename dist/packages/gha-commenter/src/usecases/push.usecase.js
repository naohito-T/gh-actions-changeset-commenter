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
exports.pushUsecase = void 0;
const core = __importStar(require("@actions/core"));
const repository_1 = require("../repository");
/**
 * @desc push eventの際に使用するusecase
 * 1. baseブランチの最新マージコミットを取得する
 * 2. from（自身）に向いていたclosedのプルリクエスト一覧を取得する
 * 3. baseに向いているプルリクエスト一覧から最新を取得
 * 4. fromにmergeされているプルリクでかつmergeの時間がbaseの最新mergeより未来のもの
 * */
const pushUsecase = async ({ github, context, base, }) => {
    const r = new repository_1.ApiRepository(github, context);
    const fromBranch = context.ref.replace('refs/heads/', '');
    core.debug(`from_branch: ${fromBranch}`);
    const since = (await r.fetchLatestMergeCommit({ base })).commit.committer?.date;
    if (!since) {
        core.warning(`Not found. latest commit ${base}`);
        return;
    }
    const mergedFromPRs = await r.fetchMergedPRs({ base: fromBranch });
    const latestBasePR = (await r.fetchPendingPRs({ base, per_page: 10 })).data[0].number;
    core.debug(`Update body pull_request number: ${latestBasePR}`);
    const mergedTopicPRs = mergedFromPRs.data
        .filter((pr) => pr.merged_at && new Date(pr.merged_at) > new Date(since))
        .map((d) => `- ${d.html_url}`);
    await r.updatePrMessage({ prNumber: latestBasePR, body: mergedTopicPRs });
};
exports.pushUsecase = pushUsecase;
