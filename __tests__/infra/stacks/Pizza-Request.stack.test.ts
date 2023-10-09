import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { PizzaApiStack } from "../../../src/infra/stacks/PizzaApi.stack";
import { PizzaRequestStack } from "../../../src/infra/stacks/Pizza-Request.stack";

describe("Pizza Request Test Suite", () => {
  let pizzaRequestTemplate: Template;
  

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });

    const pizzaRequestStack = new PizzaRequestStack(testApp, "PizzaRequestStack");
    pizzaRequestTemplate = Template.fromStack(pizzaRequestStack);
  });

  test.only("API Gateway Definition", async () => {
    const resources = pizzaRequestTemplate.findResources(
      "AWS::Lambda::Function",
      {}
    );
    const orderPizzaLambda = Object.entries(resources)
      // .filter(([_, resource]) => resource.Properties.FunctionName === "OrderPizzaLambda")
      .map(([_key, resource]) => resource)
      // .shift();

    console.log(JSON.stringify({ orderPizzaLambda }));
  });


});
