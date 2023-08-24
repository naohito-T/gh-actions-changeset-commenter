"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchListCommit = void 0;
/** @desc 対象のコミット一覧を取得する */
const fetchListCommit = async ({ github, context, ...args }) => {
    return await github.rest.repos.listCommits({
        ...context.repo,
        ...args,
    });
};
exports.fetchListCommit = fetchListCommit;
