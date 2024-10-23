import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import ManualWorkflow from "../workflows/ManualWorkflow.ts";

const ScheduledTrigger: Trigger<typeof ManualWorkflow.definition> = {
  name: "Scheduled Zendesk API Call",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${ManualWorkflow.definition.callback_id}`,
  inputs: {
    channel: {
      value: "C05UM1J6X8V",
    },
  },
  schedule: {
    // start_time: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0).toISOString(),
    start_time: new Date(new Date().getTime() + 10000).toISOString(), //start after 10 seconds
    timezone: "Asia/Tokyo",
    frequency: { type: "once" },
  },
};

export default ScheduledTrigger;

//Command to test this trigger on local. Be sure to run "slack run" too in a seperate window
//slack trigger create --trigger-def "triggers/ScheduledTrigger.ts"

//Remember to delete it after testing it
//slack trigger delete --trigger-id <trigger ID>

//To find the trigger ID, use this
//slack triggers list