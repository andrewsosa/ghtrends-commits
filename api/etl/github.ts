import os from "os";
import path from "path";
import rimraf from "rimraf";
import { simpleGit, SimpleGit } from "simple-git";
import { v4 as uuid } from "uuid";
import { logger } from "../utils/logger";

type ValidationError = {
  error: string;
};

export async function validateRepo(repo: string): Promise<ValidationError> {
  if (repo === undefined || repo === null || repo === "") {
    return { error: "repo cannot be empty" };
  }

  const exists = await remoteExists(repo);
  if (!exists) {
    return { error: "not a valid repo" };
  }

  return null;
}

export async function remoteExists(repo: string): Promise<boolean> {
  const git: SimpleGit = simpleGit();
  try {
    logger.info(`Checking if ${repo} exists...`);
    await git.listRemote([`http://github.com/${repo}`]);
    logger.info(`http://github.com/${repo} seems to exists...`);
    return true;
  } catch (err) {
    logger.info(`http://github.com/${repo} does not exists...`);
    logger.error(`message - ${err.message}, stack trace - ${err.stack}`);
    return false;
  }
}

export type Commit = {
  hash: string;
  date: string;
  message: string;
  refs: string;
  body: string;
  author_name: string;
  author_email: string;
  diff?: {
    changed: number;
    deletions: number;
    insertions: number;
    files: Array<unknown>;
  };
};

export async function downloadCommits(repo: string): Promise<Array<Commit>> {
  const repoPath = path.resolve(os.tmpdir(), uuid());

  // Clone the repo
  try {
    logger.info(`Starting download of ${repo} into ${repoPath}...`);

    await simpleGit().clone(`http://github.com/${repo}`, repoPath, [
      "--no-checkout",
    ]);

    const { all: commits } = await simpleGit(repoPath).log([
      `--all`,
      `--no-merges`,
      `--shortstat`,
    ]);

    const records: Array<Commit> = Array.from(commits);
    logger.info(`Downloaded ${records.length} commits from ${repo}.`);
    return records;
  } catch (err) {
    // If there's an error anywhere, catch and report
    console.error(err);
    throw err;
  } finally {
    // Lastly, make sure we cleanup
    try {
      await new Promise<void>((res, rej) => {
        rimraf(repoPath, (err) => {
          if (err) rej(err);
          else {
            logger.info(`Removed ${repoPath}.`);
            res();
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
}
