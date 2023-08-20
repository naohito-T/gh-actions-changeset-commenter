"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchBodyMessage = exports.fetchBranch = void 0;
/** @desc branchを取得する */
const fetchBranch = async ({ github, context, branch, ...args // この部分が任意のオブジェクトを受け取るための変更
 }) => await github.rest.repos.getBranch({
    ...context.repo,
    branch,
    ...args,
});
exports.fetchBranch = fetchBranch;
/**
 * @desc ブランチにマージメッセージを反映させる
 * @deprecated 403で対応ができない
 */
const updateBranchBodyMessage = async ({ github, context, branch, body, }) => {
    await github.rest.repos.update({
        ...context.repo,
        base: branch,
        body,
    });
};
exports.updateBranchBodyMessage = updateBranchBodyMessage;
