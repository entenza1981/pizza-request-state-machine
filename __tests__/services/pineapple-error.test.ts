import { describe } from "node:test";

import { main as pineappleError } from "../../src/services/pineapple-error";

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
      containsPineapple: true,
    };
  };

  test("Function should be defined", () => {
    expect(pineappleError).toBeDefined();
  });

  test('Proper information added in the result', async () => {
    const event = getEventPayload("pineapple");
    const result = await pineappleError(event, {} as any);
    expect(result).toHaveProperty("billingDetails");
    expect(result.billingDetails).toHaveProperty(
      "billedDurationInMilliseconds"
    );
    expect(result.billingDetails).toHaveProperty("billedMemoryUsedInMB");
    expect(result.status).toBe("FAILED");
    expect(result).toHaveProperty("outputDetails");
    expect(result).toHaveProperty("stopDate");
    expect(result).toHaveProperty("traceHeader");
    expect(result.cause).toBe("They asked for Pineapple");
    expect(result.error).toBe("Failed To Make Pizza");
    
  })
});
