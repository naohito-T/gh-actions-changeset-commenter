"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRepository = void 0;
const gha_core_1 = require("gha-core");
/** @desc coreライブラリに接続するRepository */
class ApiRepository {
    github;
    context;
    constructor(github, context) {
        this.github = github;
        this.context = context;
    }
    /** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
    fetchPRBodyMessage = async (prNumber) => {
        const pr = await (0, gha_core_1.fetchPullRequest)({
            github: this.github,
            context: this.context,
            prNumber,
        });
        return pr.data.body;
    };
    /** @desc 指定のbase branchに向いているOpen PRsを取得する */
    fetchPendingPRs = async ({ base, per_page = 100 }) => await (0, gha_core_1.fetchPullRequestList)({
        github: this.github,
        context: this.context,
        base,
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page,
    });
    /** @desc 指定のbase branchに向いておりmergeされたPRsを取得する */
    fetchMergedPRs = async ({ base, per_page = 100 }) => await (0, gha_core_1.fetchPullRequestList)({
        github: this.github,
        context: this.context,
        base,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page,
    });
    /** @desc 自身にmergeされたプルリクエストを取得する */
    fetchMergedSelfPRs = async ({ prNumber }) => await (0, gha_core_1.fetchPullRequestList)({
        github: this.github,
        context: this.context,
        pull_number: prNumber,
        state: 'closed',
        per_page: 100,
    });
    /** @desc 対象のPR bodyをupdateする */
    updatePrMessage = async ({ prNumber, body, }) => {
        await (0, gha_core_1.updatePullRequestMessage)({
            github: this.github,
            context: this.context,
            prNumber,
            body: `${body.join('\n')}`,
        });
    };
    /**
     * @desc 指定されたbaseブランチの最新マージコミットを取得する
     * @note shaにはdevelopなどのブランチ名でもよい
     * @note Merge pull request #29 hoge などの際sん1件を取得する
     */
    fetchLatestMergeCommit = async ({ base }) => {
        const baseCommits = await (0, gha_core_1.fetchListCommit)({
            github: this.github,
            context: this.context,
            sha: base,
            per_page: 10,
        });
        const latestMergeCommit = baseCommits.data.find((commit) => commit.commit.message.startsWith('Merge'));
        if (!latestMergeCommit)
            throw new Error(`Not ${base} Latest MergeCommit`);
        return latestMergeCommit;
    };
}
exports.ApiRepository = ApiRepository;
