"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReCaptchaVerificationError = exports.ReCaptchaLoadError = exports.SnsUnlinkUnavailableError = exports.UnexpectedError = exports.UnauthorizedError = exports.NotFoundError = exports.IncorrectError = void 0;
class BaseError extends Error {
    statusCode;
    message;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.statusCode = statusCode;
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
/** @desc ログインしていない */
class UnauthorizedError extends BaseError {
}
exports.UnauthorizedError = UnauthorizedError;
/** @desc 予期せぬエラー */
class UnexpectedError extends BaseError {
}
exports.UnexpectedError = UnexpectedError;
/** @desc SNSが1つしか連携していない場合、解除ができないエラー */
class SnsUnlinkUnavailableError extends BaseError {
}
exports.SnsUnlinkUnavailableError = SnsUnlinkUnavailableError;
/** Recaptcha のロード失敗時にスローするエラー */
class ReCaptchaLoadError extends BaseError {
}
exports.ReCaptchaLoadError = ReCaptchaLoadError;
/** Recaptcha による検証に失敗したときのエラー */
class ReCaptchaVerificationError extends BaseError {
}
exports.ReCaptchaVerificationError = ReCaptchaVerificationError;
