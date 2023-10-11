import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StepFunctions } from "aws-sdk";

const extraInfo = (
  flavor: string,
) => {

  console.log("===============================================");
  console.log("===============================================");

  return {

    executionArn: "arn:aws:...",
    input: { flavor },
    inputDetails: {
      __type:
        "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
      included: true,
    },
    name: "6e520263-96db-4b80-9b70-659a6972c806",

    startDate: new Date().getTime(),
    stateMachineArn: "arn:aws:...",
    traceHeader: process.env._X_AMZN_TRACE_ID,
  };
};
type BodyRequest = {
  flavour: string;
};
const getFlavor = (
  bodyrequest: BodyRequest,
  
) => {
  const { flavour } = bodyrequest;

  if (!flavour) {
    console.error("Flavor property not found on request");
    throw new Error("Flavor property must be specified");
  }

  return flavour;
};

export const main = async (event: any, context: Context) => {
  console.log("event: ", { event });
  console.log("context: ", { context });
  const flavour = getFlavor(event.body);

  const response = {
    ...extraInfo(flavour /**, executionDetails */),
    containsPineapple: flavour === "pineapple",
  };
  console.log("response: ", response);
  return response;
};
