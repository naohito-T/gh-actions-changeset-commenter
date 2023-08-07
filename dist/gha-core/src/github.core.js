"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePullRequestMessage = exports.fetchPullRequests = void 0;
const fetchPullRequests = async ({ github, context, prNumber }) => {
    return await github.rest.pulls.get({
        ...context.repo,
        pull_number: prNumber,
    });
};
exports.fetchPullRequests = fetchPullRequests;
// プルリクエストにマージメッセージを反映させる
const updatePullRequestMessage = async ({ github, context, prNumber, body }) => {
    await github.rest.pulls.update({
        ...context.repo,
        pull_number: prNumber,
        body,
    });
};
exports.updatePullRequestMessage = updatePullRequestMessage;
