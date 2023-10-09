import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { PizzaApiStack } from "../../../src/infra/stacks/PizzaApi.stack";
import { PizzaRequestStack } from "../../../src/infra/stacks/Pizza-Request.stack";

describe("Pizza Request API Gateway Test Suite", () => {
  let apiStackTemplate: Template;
  const PIZZA = "pizza";

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });

    const pizzaRequest = new PizzaRequestStack(testApp, "PizzaRequestStack");
    const apiStack = new PizzaApiStack(testApp, "MonitorStack", {
      orderPizzaIntegrationStateMachine: pizzaRequest.getStateMachine(),
    });
    apiStackTemplate = Template.fromStack(apiStack);
  });

  test("API Gateway Definition", async () => {
    apiStackTemplate.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Description: "The best place to have a pizza!",
      Name: "Pizza Service",
    });
  });

  test(`API Gateway has ${PIZZA} resource`, () => {
    apiStackTemplate.hasResourceProperties("AWS::ApiGateway::Resource", {
      PathPart: PIZZA,
    });
  });

  test(`API Gateway Resource ${PIZZA} has POST method and has integration with step machine`, () => {
    // Asegúrate de que el recurso 'pizza' exista y obtén su ResourceId.
    const resources = apiStackTemplate.findResources(
      "AWS::ApiGateway::Resource",
      {}
    );

    // finding resources
    const pizzaResourceId = Object.entries(resources)
      .filter(([_, resource]) => resource.Properties.PathPart === PIZZA)
      .map(([resourceId, resource]) => resourceId)
      .shift();
    // console.log(JSON.stringify({ pizzaResourceId }));

    // finding methods
    const methods = apiStackTemplate.findResources(
      "AWS::ApiGateway::Method",
      {}
    );
    const postMethod = Object.entries(methods)
      .filter(
        ([_, resource]) =>
          resource.Properties.ResourceId.Ref === pizzaResourceId &&
          resource.Properties.HttpMethod === "POST"
      )
      .map(([_key, resource]) => resource)
      .shift();
    // .map(([_key, resource]) => resource);
    // console.log(JSON.stringify(postMethod, null, 2));
    expect(postMethod).toBeDefined();

    // postMethod.Properties.Integration.Type = "AWS";
    const uris = postMethod?.Properties.Integration.Uri["Fn::Join"];
    const uri = uris
      .flatMap((uri: string | [object]) => uri)
      .filter((uri: string | object) => typeof uri === "string")
      .join("");
    expect(
      uri.includes("StartExecution") || uri.includes("StartSyncExecution")
    ).toBeTruthy();

    // .shouldMatch(
    //   /arn:aws:apigateway:us-east-1:states:action\/StartExecution/
    // );

    // postMethod.u
  });
});
