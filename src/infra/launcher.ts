import { App } from "aws-cdk-lib";

import { PizzaApiStack } from "./stacks/PizzaApi.stack";
import { PizzaRequestStack } from "./stacks/Pizza-Request.stack";

const app = new App();

const pizzaRequest = new PizzaRequestStack(app , "PizzaRequestStack");

new PizzaApiStack(app, "PizzaApiStack", {
  orderPizzaIntegrationStateMachine: pizzaRequest.getStateMachine(),
});