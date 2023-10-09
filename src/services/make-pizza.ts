import { Context } from "aws-lambda";

export const main = async (event: any, context: Context) => {
  
  console.log("Envent Info...", { event });
  console.log({ context });

  const {
    containsPineapple,
    executionArn,
    input,
    startDate,
    inputDetails,
    name,
    stateMachineArn,
    traceHeader,
  } = event;
  const stopDate = new Date().getTime()
  return {
    billingDetails: {
      billedDurationInMilliseconds: stopDate - startDate,
      billedMemoryUsedInMB: 64,
    },
    executionArn,
    input,
    inputDetails,
    name,
    output: { containsPineapple },
    outputDetails: {
      __type:
        "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
      included: true,
    },
    startDate,
    stateMachineArn,
    status: "SUCCEEDED",
    stopDate,
    traceHeader,
  };
};
