import { APIGatewayProxyResult } from "aws-lambda";

export function response(
  statusCode: number,
  body: unknown,
): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
