import { Stack, StackProps, Duration } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import * as logs from "aws-cdk-lib/aws-logs";

import { getPizzaRequestLambdaFunctions } from "./pizza-request-lambda.functions";

export class PizzaRequestStack extends Stack {
  private readonly stateMachine: sfn.IStateMachine;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const { orderPizza, makePizza, pineappleError } =
      getPizzaRequestLambdaFunctions(this);

    const failState = new sfn.Succeed(this, "PineappleErrorFailState");
    pineappleError.next(failState);

    const checkPineappleChoice = new sfn.Choice(this, "CheckPineappleChoice", {
      inputPath: "$",
    });

    checkPineappleChoice
      .when(
        sfn.Condition.booleanEquals(
          "$.pineappleAnalysis.containsPineapple",
          true
        ),
        pineappleError
      )
      .otherwise(makePizza);

    /** ------------------ State Machine Definition ------------------ */
    const logGroup = new logs.LogGroup(this, "PizzaRequestLogGroup", {
      retention: logs.RetentionDays.ONE_DAY,
    });

    const definition = sfn.Chain.start(orderPizza).next(checkPineappleChoice);

    // Create state machine
    this.stateMachine = new sfn.StateMachine(this, "PizzaRequestStateMachine", {
      // definition,
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
      stateMachineType: sfn.StateMachineType.EXPRESS,
      timeout: Duration.minutes(5),
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });

    const stateMachineArn = this.stateMachine.stateMachineArn;
    console.log({ stateMachineArn });
  }

  public getStateMachine(): sfn.IStateMachine {
    return this.stateMachine;
  }
}
