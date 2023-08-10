import { NonSlashedString } from './util.type';

/** @desc `refs/heads/hoge` の'refs/heads/'は不要 */
export interface RefBranch<T extends string> {
  branch: NonSlashedString<T>;
}

export type UpdateBranchBodyMessage<T extends string> = RefBranch<T> & {
  body: string;
};
