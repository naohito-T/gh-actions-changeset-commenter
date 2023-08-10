export interface FromBranch {
  from: string;
}
export interface BaseBranch {
  base: string;
}

export type CustomGitHubContext = BaseBranch & FromBranch;

export interface UpdateBodyMessage {
  title: string;
  htmlLink: string;
}
