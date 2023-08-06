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
const wait_1 = require("./wait");
const main = async ({ github, context }) => {
    try {
        console.log('github ggg', github);
        console.log('context ggg', context);
        const msString = core.getInput('milliseconds') || '1';
        console.log('gitlog', github.log.debug(`Waiting ${msString} milliseconds ...`)); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
        const ms = parseInt(msString, 10);
        if (isNaN(ms)) {
            throw new Error('milliseconds not a number');
        }
        console.log('gitlog2', github.log.debug(new Date().toTimeString()));
        await (0, wait_1.wait)(ms);
        console.log('gitlog3', github.log.debug(new Date().toTimeString()));
        console.log(core.setOutput('timesssssssssssss', new Date().toTimeString()));
    }
    catch (e) {
        if (e instanceof Error)
            core.setFailed(e.message);
    }
};
exports.main = main;
