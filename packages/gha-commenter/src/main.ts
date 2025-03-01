#!/usr/bin/env node

import * as core from '@actions/core';
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { errorHandler, IncorrectError } from 'gha-core';
import { container } from './container';

/**
 * @description Pull Requestに対してbase ← fromの差分のPull Requestタイトルを反映する
 */
export const main = async (): Promise<void> => {
  try {
    // merge先のブランチ名
    const base = core.getInput('base');
    const octokit = github.getOctokit(core.getInput('github-token'));
    const context = new Context();
    core.debug(
      `Start gh-actions-changeset-commenter to main, base: ${base} eventName: ${context.eventName}`,
    );
    const { pushUsecase, pullRequestUsecase } = container(octokit, context);

    switch (context.eventName) {
      case 'push':
        await pushUsecase({ base });
        break;
      case 'pull_request':
        await pullRequestUsecase({ base });
        break;
      default:
        throw new IncorrectError('This event is not supported.');
    }

    core.setOutput('result', ``);
  } catch (e: unknown) {
    const { message } = errorHandler(e);
    core.setFailed(message);
  }
};
