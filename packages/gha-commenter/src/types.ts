export interface FromBranch {
  from: string;
}
export interface BaseBranch {
  base: string;
}

export type CustomGitHubContext = BaseBranch & FromBranch;
