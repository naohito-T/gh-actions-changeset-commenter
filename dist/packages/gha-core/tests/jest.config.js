"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_config_1 = __importDefault(require("../../../jest.config"));
const config = {
    ...jest_config_1.default,
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/../src/$1',
        '~/(.*)$': '<rootDir>/../$1',
    },
};
exports.default = config;
