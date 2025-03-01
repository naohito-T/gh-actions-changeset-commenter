/** @desc PR merge元 */
export interface FromBranch {
  from: string;
}

/** @desc PR merge先 */
export interface BaseBranch {
  base: string;
}

export type BaseWithFromBranch = BaseBranch & FromBranch;

export interface UpdateBodyMessage {
  title: string;
  htmlLink: string;
}
