"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePullRequestMessage = exports.fetchPullRequestList = exports.fetchPullRequest = void 0;
/** @desc プルリクエストを取得する */
const fetchPullRequest = async ({ github, context, prNumber, ...args // この部分が任意のオブジェクトを受け取るための変更
 }) => {
    return await github.rest.pulls.get({
        ...context.repo,
        pull_number: prNumber,
        ...args,
    });
};
exports.fetchPullRequest = fetchPullRequest;
/** @desc baseに向いているプルリクエスト一覧を取得する */
const fetchPullRequestList = async ({ github, context, base, ...args // この部分が任意のオブジェクトを受け取るための変更
 }) => {
    return await github.rest.pulls.list({
        ...context.repo,
        base,
        ...args,
    });
};
exports.fetchPullRequestList = fetchPullRequestList;
/** @desc fromに向いているプルリクをさガス */
// export const fetchFromPullRequestList = async ({
//   github,
//   context,
//   base,
//   ...args // この部分が任意のオブジェクトを受け取るための変更
// }: GitHubContext & { base?: string } & CustomArgs) => {
//   return await github.rest.pulls.list({
//     ...context.repo, // owner && repo
//     base, // PR target base branch
//     ...args,
//   });
// };
/** @desc プルリクエストにマージメッセージを反映させる */
const updatePullRequestMessage = async ({ github, context, prNumber, body, }) => {
    await github.rest.pulls.update({
        ...context.repo,
        pull_number: prNumber,
        body,
    });
};
exports.updatePullRequestMessage = updatePullRequestMessage;
