"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedError = exports.NotFoundError = exports.IncorrectError = void 0;
/**
 * @desc GitHub APIのerrorはmessageで切り分ける
 * @see https://docs.github.com/ja/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28
 */
class BaseError extends Error {
    message;
    constructor(message) {
        super(message);
        this.message = message;
        this.name = new.target.name;
    }
}
/** @desc 予期せぬパラメーター */
class IncorrectError extends BaseError {
}
exports.IncorrectError = IncorrectError;
/** @desc not found */
class NotFoundError extends BaseError {
}
exports.NotFoundError = NotFoundError;
/** @desc 予期せぬエラー */
class UnexpectedError extends BaseError {
}
exports.UnexpectedError = UnexpectedError;
