import AWS from "aws-sdk";

export function dispatchETL(lambda: AWS.Lambda, repo: string): void {
  const { ETL_FUNCTION } = process.env;

  lambda.invoke(
    {
      FunctionName: ETL_FUNCTION,
      InvocationType: "Event",
      Payload: JSON.stringify({ repo }),
    },
    (err, data) => {
      if (data) console.debug(data);
      if (err) console.error(err);
    },
  );
}
