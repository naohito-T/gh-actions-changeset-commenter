class BaseError extends Error {
  constructor(readonly statusCode: number, readonly message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = new.target.name;
  }
}

/** @desc 予期せぬパラメーター */
export class IncorrectError extends BaseError {}

/** @desc not found */
export class NotFoundError extends BaseError {}

/** @desc ログインしていない */
export class UnauthorizedError extends BaseError {}

/** @desc 予期せぬエラー */
export class UnexpectedError extends BaseError {}

/** @desc SNSが1つしか連携していない場合、解除ができないエラー */
export class SnsUnlinkUnavailableError extends BaseError {}

/** Recaptcha のロード失敗時にスローするエラー */
export class ReCaptchaLoadError extends BaseError {}

/** Recaptcha による検証に失敗したときのエラー */
export class ReCaptchaVerificationError extends BaseError {}
