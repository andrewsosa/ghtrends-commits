import * as Sentry from "@sentry/serverless";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import parseDuration from "parse-duration";
import "source-map-support/register";
import { connectDB } from "./db/connect";
import { getOrCreateMetadata } from "./db/metadata";
import { getPresignedUrl } from "./etl/s3";
import { getLambdaClient } from "./utils/clients";
import { dispatchETL } from "./utils/dispatch";
import { response } from "./utils/http";
import { logger } from "./utils/logger";
import { shouldUpdateRepo } from "./utils/time";
import { validateRepo } from "./utils/validate";

Sentry.AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export async function endpoint(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  // Validate input
  const repo: string | undefined = event.queryStringParameters.repo;
  const defaultPeriod = parseDuration("1d");
  const error = validateRepo(repo);
  if (error) {
    return response(400, error);
  }

  // Check current data
  logger.info("Connecting to DB...");
  await connectDB();
  const record = getOrCreateMetadata(repo);
  if (shouldUpdateRepo(record, defaultPeriod)) {
    // Dispatch new jobs
    logger.info(`Dispatching job for ${repo}`);
    const lambda = getLambdaClient();
    dispatchETL(lambda, repo);
  }

  // URL can exist before file is uploaded
  const downloadUrl = await getPresignedUrl(repo);

  return response(200, { ...record, downloadUrl });
}

export const handler = Sentry.AWSLambda.wrapHandler(endpoint);
