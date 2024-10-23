import { Trigger } from "deno-slack-api/types.ts";
import ManualWorkflow from "../workflows/ManualWorkflow.ts";

const ManualTrigger: Trigger<typeof ManualWorkflow.definition> = {
  type: "shortcut",
  name: "Manual Zendesk API Call",
  description:
    "Makes an API call to Zendesk that generates the daily, weekly and monthly report after clicking the button",
  workflow: `#/workflows/${ManualWorkflow.definition.callback_id}`,
  inputs: {
    channel: {
      value: "C05UM1J6X8V",
    },
  },
};

export default ManualTrigger;
