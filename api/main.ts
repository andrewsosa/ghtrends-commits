import * as Sentry from "@sentry/serverless";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import { dispatchETL } from "./etl/dispatch";
import { validateRepo } from "./etl/github";
import { getPresignedUrl } from "./etl/s3";
import { getLambdaClient } from "./utils/clients";
import { response } from "./utils/http";
import { logger } from "./utils/logger";

Sentry.AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export async function endpoint(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  // Validate input
  const repo: string | undefined = event.queryStringParameters.repo;
  const error = await validateRepo(repo);
  if (error) {
    return response(400, error);
  }

  logger.info(`Dispatching job for ${repo}`);
  dispatchETL(getLambdaClient(), repo);

  // URL can exist before file is uploaded
  const downloadUrl = await getPresignedUrl(repo);

  return response(200, { downloadUrl });
}

export const handler = Sentry.AWSLambda.wrapHandler(endpoint);
