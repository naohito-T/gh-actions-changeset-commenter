"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPendingBasePRs = void 0;
const gha_core_1 = require("gha-core");
/** @desc PRでtargetが指定のbase branchに向いている一覧を取得する */
const fetchPendingBasePRs = async ({ github, context, base, }) => await (0, gha_core_1.fetchPullRequestList)({ github, context, base });
exports.fetchPendingBasePRs = fetchPendingBasePRs;
