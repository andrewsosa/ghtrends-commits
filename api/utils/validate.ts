import { remoteExists } from "../etl/github";

interface ValidationError {
  error: str;
}

export function validateRepo(repo: string): ValidationError {
  if (repo === undefined || repo === null || repo === "") {
    return { error: "repo cannot be empty" };
  }

  if (!remoteExists(repo)) {
    return { error: "not a valid repo" };
  }

  return null;
}
