import { APIGatewayProxyResult } from "aws-lambda";

export function response(
  statusCode: number,
  body: JSON
): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
