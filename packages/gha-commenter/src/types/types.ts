/** @desc PR merge元 */
export interface FromBranch {
  from: string;
}

/** @desc PR merge先 */
export interface BaseBranch {
  base: string;
}

export type BaseWithFromBranch = BaseBranch & FromBranch;

/** @desc actions/github-script実行時に与えられる引数 */
export type CustomGitHubContext = BaseBranch;

export interface UpdateBodyMessage {
  title: string;
  htmlLink: string;
}
