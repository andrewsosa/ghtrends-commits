import os from "os";
import path from "path";
import rimraf from "rimraf";
import git from "simple-git/promise";
import { v4 as uuid } from "uuid";
import { logger } from "../utils/logger";

export async function remoteExists(repo: string): Promise<boolean> {
  try {
    logger.info(`Checking if ${repo} exists...`);
    await git().listRemote([`http://github.com/${repo}`]);
    logger.info(`http://github.com/${repo} seems to exists...`);
    return true;
  } catch (err) {
    logger.info(`http://github.com/${repo} does not exists...`);
    return false;
  }
}

export async function downloadCommits(repo: string): Promise<JSON> {
  const repoPath = path.resolve(os.tmpdir(), uuid());
  let records: Array<unknown> = [];

  // Clone the repo
  try {
    logger.info(`Starting download of ${repo} into ${repoPath}...`);
    await git().clone(`http://github.com/${repo}`, repoPath, ["--no-checkout"]);
    logger.info(`Downloaded ${repo}.`);

    // Get and return log
    const { all: commits } = await git(repoPath).log([
      `--all`,
      `--no-merges`,
      `--shortstat`,
    ]);

    // Annotate records with the repo
    records = Array.from(commits).map((el) => ({ ...el, repo }));
  } catch (err) {
    // If there's an error anywhere, catch and report
    console.error(err);
  } finally {
    // Lastly, make sure we cleanup
    try {
      await new Promise((res, rej) => {
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

  return records;
}
