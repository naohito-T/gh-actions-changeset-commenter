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
const gha_core_1 = require("gha-core");
const usecases_1 = require("./usecases");
/** @desc Pull Requestに対してbase ← fromの差分のPull Requestタイトルを反映する */
const main = async ({ github, context, base, // merge先
 }) => {
    try {
        if (!base)
            throw new gha_core_1.IncorrectError(`Missing parameters ${base}: Please README`);
        switch (context.eventName) {
            case 'push':
                await (0, usecases_1.pushUsecase)({ github, context, base });
                break;
            case 'pull_request':
                await (0, usecases_1.pullRequestUsecase)({ github, context, base });
                break;
            default:
                throw new gha_core_1.IncorrectError('This event is not supported.');
        }
        core.setOutput('result', ``);
    }
    catch (e) {
        const { message } = (0, gha_core_1.errorHandler)(e);
        core.setFailed(message);
    }
};
exports.main = main;
