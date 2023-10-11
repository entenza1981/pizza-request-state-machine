import { Context } from "aws-lambda";
import { describe } from "node:test";

import { main as orderPizza } from "../../src/services/order-pizza";

describe("Order Pizza Lambda Function Test Suite", () => {
  test("The function is defined", async () => {
    expect(orderPizza).toBeDefined();
  });

  test("If flavour is not specified the throw exception", (done) => {
    orderPizza(
      {
        body: {},
      },
      {} as Context
    ).catch((error) => {
      expect(error.message).toBe("Flavor property must be specified");
      done();
    });
  });

  test("Proper information added on the result", async () => {
    const result = await orderPizza(
      {
        body: { flavour: "pepperoni" },
      },
      {} as Context
    );
    expect(result).toHaveProperty("executionArn");
    expect(result).toHaveProperty("input");
    expect(result.input).toHaveProperty("flavour");
    expect(result.input.flavour).toBe("pepperoni");
    expect(result).toHaveProperty("inputDetails");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("startDate");
    expect(result).toHaveProperty("stateMachineArn");
    expect(result).toHaveProperty("traceHeader");
    expect(result).toHaveProperty("containsPineapple");
  });
});
