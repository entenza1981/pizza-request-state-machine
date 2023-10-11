import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StepFunctions } from "aws-sdk";
/**
 * Extra info to send al over the flow
 */
const extraInfo = (
  flavour: string,
) => {

  console.log("===============================================");
  console.log("===============================================");

  return {

    executionArn: "arn:aws:...",
    input: { flavour },
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


/**
 * 
 * This function is used to fetch the flavor from the request
 * and throw an error if the flavor is not specified
 */
const getFlavor = (
  bodyrequest: BodyRequest,
) => {
  const { flavour } = bodyrequest;
  if (!flavour) {
    throw new Error("Flavor property must be specified");
  }

  return flavour;
};

/**
 * 
 * Just fetch the flavor from the request and put it into the response
 */
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
