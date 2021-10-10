import { RepoMetadata } from "../db/metadata";

export function shouldUpdateRepo(
  record: ?RepoMetadata,
  requestedPeriod: unknown
): bool {
  if (!record || !record.updatedAt) {
    return true;
  }

  const now = new Date();
  const difference = Math.abs(record.updatedAt - now);
  if (difference > requestedPeriod) {
    return true;
  }

  return false;
}
