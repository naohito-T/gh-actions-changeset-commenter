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
exports.fetchLatestMergeCommit = exports.fetchPRsMergedInFromNotBase = exports.fetchMergedSelfPRs = exports.fetchMergedBasePRsTitle = exports.fetchPendingPRsBaseTarget = exports.fetchPRBodyMessage = void 0;
const core = __importStar(require("@actions/core"));
const util_1 = require("util");
const gha_core_1 = require("gha-core");
/** -------------------
 * Pull Request
 *  -------------------/

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
const fetchPRBodyMessage = async ({ github, context, prNumber, }) => {
    const pr = await (0, gha_core_1.fetchPullRequest)({
        github,
        context,
        prNumber,
    });
    return pr.data.body;
};
exports.fetchPRBodyMessage = fetchPRBodyMessage;
/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
const fetchPendingPRsBaseTarget = async ({ github, context, base, }) => await (0, gha_core_1.fetchPullRequestList)({ github, context, base, state: 'open' });
exports.fetchPendingPRsBaseTarget = fetchPendingPRsBaseTarget;
/**
 * @desc target branchにmerge済みのブランチタイトル一覧を取得する
 * @see https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28
 */
const fetchMergedBasePRsTitle = async ({ github, context, base, }) => {
    const response = await (0, gha_core_1.fetchPullRequestList)({
        github,
        context,
        base,
        state: 'closed',
        per_page: 100,
    });
    return response.data.filter((pr) => pr.merged_at).map((pr) => pr.title);
};
exports.fetchMergedBasePRsTitle = fetchMergedBasePRsTitle;
/** @desc 自身にmergeされたプルリクエストを取得する */
const fetchMergedSelfPRs = async ({ github, context, prNumber, }) => {
    return await (0, gha_core_1.fetchPullRequestList)({
        github,
        context,
        pull_number: prNumber,
        state: 'closed',
        per_page: 100,
    });
};
exports.fetchMergedSelfPRs = fetchMergedSelfPRs;
/** @desc base ← from: from merged not merge base */
const fetchPRsMergedInFromNotBase = async ({ github, context, base, from, }) => {
    /**
     * @desc developにマージされたがmainにはマージされていないプルリクエストのタイトルを取得
     * @note これにはマージされていないがクローズされたプルリクエストも含まれる
     */
    const fromMergedPRs = await (0, gha_core_1.fetchPullRequestList)({
        github,
        context,
        base: from,
        state: 'closed',
        per_page: 100,
    });
    core.debug(`Inspect mergedPRsHtmlLinks${(0, util_1.inspect)(fromMergedPRs)}`);
    /**
     * @desc baseにmergeされたpull requestを取得する
     * @note これにはマージされていないがクローズされたプルリクエストも含まれる
     */
    const baseMergedPRs = await (0, gha_core_1.fetchPullRequestList)({
        github,
        context,
        base,
        state: 'closed',
        per_page: 100,
    });
    core.debug(`Inspect baseMergedPRs${(0, util_1.inspect)(baseMergedPRs)}`);
    console.log(`develop merged pull re${fromMergedPRs.data.map((d) => d.number)}`);
    console.log(`main merged pull re${baseMergedPRs.data.map((d) => d.number)}`);
    return fromMergedPRs.data
        .filter((developPR) => 
    // マージされたもののみをチェック
    developPR.merged_at &&
        // mainにマージされていないものをチェック
        !baseMergedPRs.data.some((mainPR) => mainPR.number === developPR.number && !mainPR.merged_at))
        .map((pr) => pr._links.html.href);
};
exports.fetchPRsMergedInFromNotBase = fetchPRsMergedInFromNotBase;
/**
 * @desc 指定されたbaseブランチの最新マージコミットを取得する
 * @note shaにはdevelopなどのブランチ名でもよい
 * @note Merge pull request #29 hoge などの際sん1件を取得する
 */
const fetchLatestMergeCommit = async ({ github, context, base }) => {
    const baseCommits = await (0, gha_core_1.fetchListCommit)({
        github,
        context,
        sha: base,
        per_page: 100,
    });
    const latestMergeCommit = baseCommits.data.find((commit) => commit.commit.message.startsWith('Merge'));
    if (!latestMergeCommit)
        throw new Error(`Not ${base} Latest MergeCommit`);
    return latestMergeCommit;
};
exports.fetchLatestMergeCommit = fetchLatestMergeCommit;
