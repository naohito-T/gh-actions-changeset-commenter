/** @desc PR元 */
export interface FromBranch {
  from: string;
}

/** @desc PRのmerge先 */
export interface BaseBranch {
  base: string;
}

export type CustomGitHubContext = BaseBranch & FromBranch;

export interface UpdateBodyMessage {
  title: string;
  htmlLink: string;
}
