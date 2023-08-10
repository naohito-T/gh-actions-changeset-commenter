/**
 * @desc GitHub APIのerrorはmessageで切り分ける
 * @see https://docs.github.com/ja/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28
 */
class BaseError extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** @desc 予期せぬパラメーター */
export class IncorrectError extends BaseError {}

/** @desc not found */
export class NotFoundError extends BaseError {}

/** @desc 予期せぬエラー */
export class UnexpectedError extends BaseError {}
