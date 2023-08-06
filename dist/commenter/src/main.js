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
exports.main = void 0;
const core = __importStar(require("@actions/core"));
/**
 * @desc main ブランチに今までコミットされたコミットメッセージを付与する
 * @note デバッグはシークレット `ACTIONS_STEP_DEBUG` をtrueに設定した場合のみ出力される
 */
const main = async ({ github, context }) => {
    try {
        // console.log('github ggg', github);
        // console.log('context ggg', context);
        // const msString: string = core.getInput('milliseconds') || '1';
        // console.log(inspect('gitlog', github.log.debug(`Waiting ${msString} milliseconds ...`)));
        // const ms: number = parseInt(msString, 10);
        // if (isNaN(ms)) {
        //   throw new Error('milliseconds not a number');
        // }
        // console.log('gitlog2', github.log.debug(new Date().toTimeString()));
        // await wait(ms);
        // console.log('gitlog3', github.log.debug(new Date().toTimeString()));
        // console.log(core.setOutput('timesssssssssssss', new Date().toTimeString()));
        // プルリクエストの情報を取得
        const prNumber = context.payload.pull_request?.number;
        if (!prNumber) {
            throw new Error('Pull request number not found.');
        }
        // プルリクエストの情報を取得してマージメッセージを取得
        const pr = await github.rest.pulls.get({
            ...context.repo,
            pull_number: prNumber,
        });
        const mergeMessage = pr.data.title; // 例としてプルリクエストのタイトルをマージメッセージとする
        // プルリクエストにマージメッセージを反映させる
        await github.rest.pulls.update({
            ...context.repo,
            pull_number: prNumber,
            body: mergeMessage,
        });
        console.log(`Merge message "${mergeMessage}" has been applied to the pull request.`);
    }
    catch (e) {
        if (e instanceof Error)
            core.setFailed(e.message);
    }
};
exports.main = main;
