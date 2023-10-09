/** ------------------ Lambda Handlers Definition ------------------ */

import { Stack } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { join } from "path";

export const getPizzaRequestLambdaFunctions = (stack: Stack) => {
  const basePath = join(__dirname, "..", "..", "services");
  const runtime = Runtime.NODEJS_18_X;
  const handler = "main";

  const orderPizzaLambdaPath = join(basePath, "order-pizza.ts");
  const orderPizzaLambda = new NodejsFunction(stack, "OrderPizzaLambda", {
    runtime,
    handler,
    entry: orderPizzaLambdaPath,
  });

  const makePizzaLambdaPath = join(basePath, "make-pizza.ts");
  const makePizzaLambda = new NodejsFunction(stack, "MakePizzaLambda", {
    runtime,
    handler,
    entry: makePizzaLambdaPath,
  });

  const pineappleErrorLambdaPath = join(basePath, "pineapple-error.ts");
  const pineappleErrorLambda = new NodejsFunction(
    stack,
    "PineappleErrorLambda",
    {
      runtime,
      handler,
      entry: pineappleErrorLambdaPath,
    }
  );

  /** ------------------ Step Functions Invokes ------------------ */
  const orderPizza = new tasks.LambdaInvoke(stack, "OrderPizzaInvoke", {
    lambdaFunction: orderPizzaLambda,
    retryOnServiceExceptions: false,
    resultPath: "$.pineappleAnalysis",
    payloadResponseOnly: true,
  });

  const makePizza = new tasks.LambdaInvoke(stack, "MakePizzaInvoke", {
    lambdaFunction: makePizzaLambda,
    retryOnServiceExceptions: false,
    inputPath: "$.pineappleAnalysis",
    // resultPath: "$.",
    payloadResponseOnly: true,
  });

  const pineappleError = new tasks.LambdaInvoke(stack, "PineappleErrorInvoke", {
    lambdaFunction: pineappleErrorLambda,
    retryOnServiceExceptions: false,
    inputPath: "$.pineappleAnalysis",
    // resultPath: "$.",
    payloadResponseOnly: true,
  });

  return {
    orderPizza,
    makePizza,
    pineappleError,
  };
};
