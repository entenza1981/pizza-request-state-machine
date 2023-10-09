import { Context } from "aws-lambda";

export const main = async (event: any, context: Context) => {
  console.log("Envent Info...", { event });
  console.log({ context });

  const {
    containsPineapple,
    startDate,
    executionArn,
    input,
    inputDetails,
    name,
    stateMachineArn,
    traceHeader,
  } = event;
  const stopDate = new Date().getTime();
  return {
    billingDetails: {
      billedDurationInMilliseconds: stopDate - startDate,
      billedMemoryUsedInMB: 64,
    },
    cause: "They asked for Pineapple",
    error: "Failed To Make Pizza",
    executionArn,
    input,
    inputDetails,
    name,
    outputDetails: {
      __type:
        "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
      included: true,
    },
    startDate,
    stateMachineArn,
    status: "FAILED",
    stopDate: new Date().getTime(),
    traceHeader,
  };
};
