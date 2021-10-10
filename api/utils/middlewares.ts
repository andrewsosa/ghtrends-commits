import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import { connectDB } from "../db/connect";

interface Handler {
  (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback
  ): APIGatewayProxyResult;
}

export const withMongoDB: Handler = (handler: Handler) => {
  return (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback
  ): APIGatewayProxyResult => {
    await connectDB();
    return handler(event, context, callback);
  };
};
