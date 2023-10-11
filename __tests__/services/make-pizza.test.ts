import { describe } from "node:test";

import { main as makePizza } from "../../src/services/make-pizza";
import exp from "node:constants";

describe("Make Pizza Lambda Function Test Suite", () => {
  
  const getEventPayload = (flavour: string) => {
    return {
      executionArn: "arn:aws:...",
      input: { flavour },
      inputDetails: {
        __type:
          "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
        included: true,
      },
      name: "6e520263-96db-4b80-9b70-659a6972c806",
      startDate: 1697065828294,
      stateMachineArn: "arn:aws:...",
      traceHeader: undefined,
      containsPineapple: false,
    };
  };

  test("Function should be defined", () => {
    expect(makePizza).toBeDefined();
  });

  test('Proper information added in the result', async () => {

    const event = getEventPayload('pineapple');
    const result = await makePizza(event, {} as any);
    console.log(result);
    expect(result).toHaveProperty("billingDetails");
    expect(result.billingDetails).toHaveProperty(
      "billedDurationInMilliseconds"
    );
    expect(result.billingDetails).toHaveProperty("billedMemoryUsedInMB");
    expect(result.status).toBe("SUCCEEDED");
    expect(result).toHaveProperty("output");
    expect(result.output).toHaveProperty("containsPineapple");
    expect(result.output.containsPineapple).toBe(false);
    expect(result).toHaveProperty("outputDetails");
    expect(result).toHaveProperty("stopDate");
    expect(result).toHaveProperty("traceHeader");
  })
});
