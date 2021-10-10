import AWS from "aws-sdk";

export function dispatchETL(lambda: AWS.Lambda, repo: string): null {
  const { STAGE } = process.env;

  lambda.invoke(
    {
      FunctionName: `ghtrends-commits-${STAGE}-etl`,
      InvocationType: "Event",
      Payload: JSON.stringify({ repo }),
    },
    (err, data) => {
      if (data) console.debug(data);
      if (err) console.error(err);
    }
  );
}
