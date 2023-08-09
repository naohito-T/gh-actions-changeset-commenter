import { NumericRange } from './util.type';

/**
 * @desc pull request types
 * @see https://docs.github.com/ja/rest/pulls/pulls?apiVersion=2022-11-28
 * @note base（pull request先）from（pull request）
 */

/** @desc PR status */
export type PullRequestStatus = 'open' | 'closed' | 'all';

/** @desc default 30 max 100 */
export type PerPage = NumericRange<0, 100>;

export type TargetPullRequestNumber = { prNumber: number };

export type UpdatePullRequestMessage = TargetPullRequestNumber & { body: string };

/** @desc coreに拡張引数を渡したいとき */
export type CustomArgs = Record<string, any>;
