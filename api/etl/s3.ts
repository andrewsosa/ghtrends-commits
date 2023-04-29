import { ManagedUpload } from "aws-sdk/clients/s3";
import type { Commit } from "../etl/github";
import { getS3Client } from "../utils/clients";

const { AWS_S3_BUCKET_NAME } = process.env;

export function s3Path(name: string): string {
  return `github.com/${name}.json`;
}

export async function uploadJSON(
  repo: string,
  payload: Array<Commit>,
): Promise<ManagedUpload.SendData> {
  const s3 = getS3Client();

  // per-line JSON records for each commit
  const body: string = payload.map((el) => JSON.stringify(el)).join("\n");

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: s3Path(repo),
        Body: body,
      },
      (err, data) => {
        err ? reject(err) : resolve(data);
      },
    );
  });
}

export async function getPresignedUrl(repo: string): Promise<string> {
  const s3 = getS3Client();
  return s3.getSignedUrlPromise("getObject", {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: s3Path(repo),
    Expires: 604800, // 7 days
  });
}
