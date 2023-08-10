"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBranchBodyMessage = exports.fetchPRsMergedInFromNotBase = exports.fetchMergedSelfPRs = exports.fetchMergedBasePRsTitle = exports.fetchPendingPRsBaseTarget = exports.fetchPRBodyMessage = void 0;
const core_1 = require("gha-core/src/core");
/** -------------------
 * Pull Request
 *  -------------------/

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
const fetchPRBodyMessage = async ({ github, context, prNumber, }) => {
    const pr = await (0, core_1.fetchPullRequest)({
        github,
        context,
        prNumber,
    });
    return pr.data.body;
};
exports.fetchPRBodyMessage = fetchPRBodyMessage;
/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
const fetchPendingPRsBaseTarget = async ({ github, context, base, }) => await (0, core_1.fetchPullRequestList)({ github, context, base, state: 'open' });
exports.fetchPendingPRsBaseTarget = fetchPendingPRsBaseTarget;
/**
 * @desc target branchにmerge済みのブランチタイトル一覧を取得する
 * @see https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28
 */
const fetchMergedBasePRsTitle = async ({ github, context, base, }) => {
    const response = await (0, core_1.fetchPullRequestList)({
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
    return await (0, core_1.fetchPullRequestList)({
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
    // developにマージされたがmainにはマージされていないプルリクエストのタイトルを取得
    // これを自身にmergeされたプルリクエストメソッド
    const fromMergedPRs = await (0, core_1.fetchPullRequestList)({
        github,
        context,
        base: from,
        state: 'closed',
        per_page: 100,
    });
    // baseにmergeされたpull requestを取得する
    const baseMergedPRs = await (0, core_1.fetchPullRequestList)({
        github,
        context,
        base,
        state: 'closed',
        per_page: 100,
    });
    return fromMergedPRs.data
        .filter((developPR) => developPR.merged_at &&
        !baseMergedPRs.data.some((mainPR) => mainPR.title === developPR.title))
        .map((pr) => pr._links.html.href);
};
exports.fetchPRsMergedInFromNotBase = fetchPRsMergedInFromNotBase;
/** -------------------
 * Branch
 *  -------------------/

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
const fetchBranchBodyMessage = async ({ github, context, branch, }) => {
    const br = await (0, core_1.fetchBranch)({
        github,
        context,
        branch,
    });
};
exports.fetchBranchBodyMessage = fetchBranchBodyMessage;
