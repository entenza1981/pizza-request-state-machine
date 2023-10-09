import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { PizzaRequestStack } from "../../../src/infra/stacks/Pizza-Request.stack";
type Resources = {
  [key: string]: {
    [key: string]: any;
  };
};

describe("Pizza Request Test Suite", () => {
  let pizzaRequestTemplate: Template;
  let lambdaResources: Resources;
  const getLambdas = (): Resources => {
    return {
      ...JSON.parse(JSON.stringify(lambdaResources)),
    };
  };

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });

    const pizzaRequestStack = new PizzaRequestStack(
      testApp,
      "PizzaRequestStack"
    );
    pizzaRequestTemplate = Template.fromStack(pizzaRequestStack);
    lambdaResources = pizzaRequestTemplate.findResources(
      "AWS::Lambda::Function"
    );
  });

  test("OrderPizza Lambda Function is defined", () => {
    const lambdas = getLambdas();
    const lambda = Object.entries(lambdas)
      .filter(([_, resource]) =>
        resource.Properties.Role["Fn::GetAtt"]
          .shift()
          .includes("OrderPizzaLambda")
      )
      .map(([_, resource]) => resource)
      .shift();

    expect(lambda).toBeDefined();
    expect(lambda?.Properties.Handler).toEqual("index.main");
    expect(lambda?.Properties.Runtime).toEqual("nodejs18.x");
  });

  test("MakePizza Lambda Function is defined", () => {
    const lambdas = getLambdas();
    const lambda = Object.entries(lambdas)
      .filter(([_, resource]) =>
        resource.Properties.Role["Fn::GetAtt"]
          .shift()
          .includes("MakePizzaLambda")
      )
      .map(([_, resource]) => resource)
      .shift();

    expect(lambda).toBeDefined();
    expect(lambda?.Properties.Handler).toEqual("index.main");
    expect(lambda?.Properties.Runtime).toEqual("nodejs18.x");
  });

  test("PineappleError Lambda Function is defined", () => {
    const lambdas = getLambdas();
    const lambda = Object.entries(lambdas)
      .filter(([_, resource]) =>
        resource.Properties.Role["Fn::GetAtt"]
          .shift()
          .includes("PineappleErrorLambda")
      )
      .map(([_, resource]) => resource)
      .shift();

    expect(lambda).toBeDefined();
    expect(lambda?.Properties.Handler).toEqual("index.main");
    expect(lambda?.Properties.Runtime).toEqual("nodejs18.x");
  });
});
