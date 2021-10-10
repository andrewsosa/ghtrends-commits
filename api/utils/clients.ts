import AWS from "aws-sdk";

const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, NODE_ENV } =
  process.env;

const DEVELOPMENT = NODE_ENV === "development";

export function getS3Client(): AWS.S3 {
  // This is the dev client
  if (DEVELOPMENT) {
    return new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId: "S3RVER", // This specific key is required when working offline
      secretAccessKey: "S3RVER",
      endpoint: new AWS.Endpoint("http://localhost:4569"),
    });

    // Prod client
    return new AWS.S3({
      accessKeyId: AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
    });
  }
}

export function getLambdaClient(): AWS.Lambda {
  if (DEVELOPMENT) {
    return new AWS.Lambda({
      apiVersion: "2031",
      // endpoint needs to be set only if it deviates from the default, e.g. in a dev environment
      // process.env.SOME_VARIABLE could be set in e.g. serverless.yml for provider.environment or function.environment
      endpoint: "http://localhost:3002",
    });
  }

  return new AWS.Lambda();
}
