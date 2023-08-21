"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVar = void 0;
const configs_1 = require("../configs");
/**
 * @desc const定数が設定されているか確認するデコレーター
 * - 対象のstageに定数が設定されているか
 * - 設定されていなくdefaultが設定されているか
 * - defaultも設定されていない場合はエラーを出力する
 */
const EnvVar = (options) => {
    const STAGE = configs_1.BaseEnv.stage;
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey, {
            get: () => {
                /**
                 * @desc != undefinedとnull同時チェックシンタックス
                 * @see https://typescript-jp.gitbook.io/deep-dive/recap/null-undefined
                 */
                if (options[STAGE] != null)
                    return options[STAGE];
                if (options.default != null)
                    return options.default;
                if (typeof propertyKey === 'string' && process.env[propertyKey] != null)
                    return process.env[propertyKey.toUpperCase()];
                throw new Error(`environment variable ${propertyKey.toString()} is not defined in ${STAGE} stage`);
            },
        });
    };
};
exports.EnvVar = EnvVar;
