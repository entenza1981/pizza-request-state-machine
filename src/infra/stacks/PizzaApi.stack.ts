import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi, StepFunctionsIntegration } from "aws-cdk-lib/aws-apigateway";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";


interface PizzaApiStackProps extends StackProps {
  orderPizzaIntegrationStateMachine: sfn.IStateMachine;
}

export class PizzaApiStack extends Stack {
  constructor(scope: Construct, id: string, props: PizzaApiStackProps) {
    super(scope, id, props);

    /**
     * API Gateway
     */
    const api = new RestApi(this, "PizzaApi", {
      restApiName: "Pizza Service",
      description: "The best place to have a pizza!",
    });

    /**
     * API Gateway Resources (POST /pizza)
     */
    const spacesResource = api.root.addResource("pizza");

    spacesResource.addMethod(
      "POST",
      StepFunctionsIntegration.startExecution(
        props.orderPizzaIntegrationStateMachine
      )
    );
  }
}
