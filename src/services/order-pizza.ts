import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StepFunctions } from "aws-sdk";

const extraInfo = (
  flavor: string,
  // execDetails: StepFunctions.Types.DescribeExecutionOutput
) => {

  console.log("===============================================");
  // console.log({ execDetails });
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

    startDate: new Date().getTime(), //execDetails.startDate.getTime(),
    stateMachineArn: "arn:aws:...",
    // stopDate: new Date().getTime(),
    traceHeader: process.env._X_AMZN_TRACE_ID,
  };
};
type BodyRequest = {
  flavour: string;
};
const getFlavor = (
  bodyrequest: BodyRequest,
  
) => {
  // const body =
  //   typeof event.body === "object"
  //     ? event.body
  //     : JSON.parse(event.body as string);
  // console.log("type of event.body: ", typeof event.body);

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

  // const executionArn = event.executionArn;

  // const stepFunctions = new StepFunctions();
  // const executionDetails = await stepFunctions
  //   .describeExecution({
  //     executionArn: executionArn,
  //   })
  //   .promise();

  const response = {
    ...extraInfo(flavour /**, executionDetails */),
    containsPineapple: flavour === "pineapple",
  };
  console.log("response: ", response);
  return response;
};
