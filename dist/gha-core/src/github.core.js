"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePullRequestMessage = exports.fetchPullRequestList = exports.fetchPullRequest = void 0;
/** @desc プルリクエストを取得する */
const fetchPullRequest = async ({ github, context, prNumber }) => {
    return await github.rest.pulls.get({
        ...context.repo,
        pull_number: prNumber,
    });
};
exports.fetchPullRequest = fetchPullRequest;
/** @desc プルリクエスト一覧を取得する */
const fetchPullRequestList = async ({ github, context, prNumber }) => {
    return await github.rest.pulls.list({
        ...context.repo,
        pull_number: prNumber,
    });
};
exports.fetchPullRequestList = fetchPullRequestList;
/** @desc プルリクエスト一覧を取得する */
// export const fetchPullRequestList = async ({ github, context, prNumber }: GitHubContext & TargetPullRequestNumber ) => {
//   return await github.rest.pulls.merge({
//     ...context.repo,
//     pull_number: prNumber,
//   });
// }
/** @desc プルリクエストにマージメッセージを反映させる */
const updatePullRequestMessage = async ({ github, context, prNumber, body }) => {
    await github.rest.pulls.update({
        ...context.repo,
        pull_number: prNumber,
        body,
    });
};
exports.updatePullRequestMessage = updatePullRequestMessage;
