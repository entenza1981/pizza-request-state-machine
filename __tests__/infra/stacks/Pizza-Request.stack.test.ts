import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { PizzaRequestStack } from "../../../src/infra/stacks/Pizza-Request.stack";
import exp from "constants";
import { String } from "aws-sdk/clients/apigateway";
type Resources = {
  [key: string]: {
    [key: string]: any;
  };
};

describe("Pizza Request States Machine Test Suite", () => {
  let pizzaRequestTemplate: Template;
  let _states: String;

  const testApp = new App({
    outdir: "cdk.out",
  });

  const pizzaRequestStack = new PizzaRequestStack(testApp, "PizzaRequestStack");
  pizzaRequestTemplate = Template.fromStack(pizzaRequestStack);
  const sfn = pizzaRequestTemplate.findResources(
    "AWS::StepFunctions::StateMachine"
  );
  const machine = Object.entries(sfn)
    .map(([_, resource]) => resource)
    .shift();
  _states = machine?.Properties.DefinitionString["Fn::Join"][1].join("");

  const getSfnStates = (): Resources => {
    return {
      ...JSON.parse(_states),
    };
  };

  test("State Machine Properties", () => {
    pizzaRequestTemplate.hasResourceProperties(
      "AWS::StepFunctions::StateMachine",
      {
        StateMachineType: "EXPRESS",
      }
    );
  });

  test("Start at Order Pizza Invoke", () => {
    const states = getSfnStates();
    expect(states.StartAt).toEqual("OrderPizzaInvoke");
  });

  // ------------------ Order Pizza Invoke ------------------
  describe("Order Pizza Invoke", () => {
    const { States: states } = getSfnStates();

    test("Order Pizza Invoke is Task", () => {
      expect(states.OrderPizzaInvoke.Type).toEqual("Task");
    });

    test("Order Pizza Invoke ResultPath is $.pineappleAnalysis", () => {
      expect(states.OrderPizzaInvoke.ResultPath).toEqual("$.pineappleAnalysis");
    });

    test("Order Pizza Invoke NEXT Check Pinapple", () => {
      expect(states.OrderPizzaInvoke.Next).toEqual("CheckPineappleChoice");
    });
  });

  // ------------------ Check Pineapple Choice ------------------
  describe("Check Pinapple", () => {
    const { States: states } = getSfnStates();

    test("Check Pinapple is Choice", () => {
      expect(states.CheckPineappleChoice.Type).toEqual("Choice");
    });

    test("Check Pinapple InputPath is $", () => {
      expect(states.CheckPineappleChoice.InputPath).toEqual("$");
    });

    test("Check Pinapple Default is MakePizzaInvoke", () => {
      expect(states.CheckPineappleChoice.Default).toEqual("MakePizzaInvoke");
    });

    describe("Check Pinapple Choice", () => {
      const choices = states.CheckPineappleChoice.Choices;
      test("Check Pinapple Choice only 1 rule", () => {
        expect(choices).toHaveLength(1);
      });

      test("If containsPineapple then Fail", () => {
        expect(choices[0].Variable).toEqual(
          "$.pineappleAnalysis.containsPineapple"
        );
        expect(choices[0].BooleanEquals).toEqual(true);
        expect(choices[0].Next).toEqual("PineappleErrorInvoke");
      });
    });
  });

  // ------------------ Make Pizza Invoke ------------------
  describe("Make Pizza Invoke", () => {
    const { States: states } = getSfnStates();

    test("Make Pizza Invoke is Task", () => {
      expect(states.MakePizzaInvoke.Type).toEqual("Task");
    });

    test("Make Pizza Invoke InputPath is $.pineappleAnalysis", () => {
      expect(states.MakePizzaInvoke.InputPath).toEqual("$.pineappleAnalysis");
    });

    test("Make Pizza Invoke is and END", () => {
      expect(states.MakePizzaInvoke.End).toEqual(true);
    });
  });

  // ------------------ Pinneaple Error Invoke ------------------
  describe("Pineapple Error Invoke", () => {
    const { States: states } = getSfnStates();

    test("Pineapple Error Invoke is Task", () => {
      expect(states.PineappleErrorInvoke.Type).toEqual("Task");
    });

    test("Pineapple Error Invoke InputPath is $.pineappleAnalysis", () => {
      expect(states.PineappleErrorInvoke.InputPath).toEqual(
        "$.pineappleAnalysis"
      );
    });

    test("Pineapple Error Invoke NEXT is Fail State", () => {
      expect(states.PineappleErrorInvoke.Next).toEqual(
        "PineappleErrorFailState"
      );
    });
  });

  // ------------------ Pinneaple Error Fail State ------------------
  describe("Fail State", () => {
    const { States: states } = getSfnStates();

    test("Faile State is defined to allow to show incoming data", () => {
      expect(states.PineappleErrorFailState.Type).toEqual("Succeed");
    });
  });
});
