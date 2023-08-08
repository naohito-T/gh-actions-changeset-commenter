"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEnv = exports.ApplicationStage = void 0;
exports.ApplicationStage = {
    local: 'local',
    dev: 'dev',
    prod: 'prod',
};
/**
 * @desc アプリケーションに`process.env.STAGE`がセットされていることを確認する
 */
class BaseEnv {
    static get isProd() {
        return this.stage === exports.ApplicationStage.prod;
    }
    static get isDev() {
        return this.stage === exports.ApplicationStage.dev;
    }
    static get isLocal() {
        return this.stage === exports.ApplicationStage.local;
    }
    static get stage() {
        const STAGE = process.env.NEXT_PUBLIC_STAGE;
        if (STAGE === undefined) {
            throw new Error(`process.env.NEXT_PUBLIC_STAGE undefined`);
        }
        else if (!Object.values(exports.ApplicationStage).some((value) => STAGE === value)) {
            throw new Error(`process.env.NEXT_PUBLIC_STAGE is invalid. Set to local, dev, or prod.`);
        }
        return STAGE;
    }
}
exports.BaseEnv = BaseEnv;
