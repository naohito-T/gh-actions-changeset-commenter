"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const class_1 = require("./class");
const errorHandler = (e) => {
    let message = null;
    // @todo ここでdatadog へlogger出力する
    if (e instanceof class_1.IncorrectError) {
        message = e.message;
    }
    else if (e instanceof Error) {
        console.error(e);
    }
    return {
        message,
    };
};
exports.errorHandler = errorHandler;
