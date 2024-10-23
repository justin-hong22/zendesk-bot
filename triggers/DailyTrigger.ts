import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import DailyWorkflow from "../workflows/DailyWorkflow.ts";

const DailyTrigger: ScheduledTrigger<typeof DailyWorkflow.definition> = {
  name: "Zendesk API Daily Report Trigger",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${DailyWorkflow.definition.callback_id}`,
  inputs: {
    channel: {
      value: "C01RA2QC03S", //CHANGE ME
    },
  },
  schedule: {
    start_time: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0, 0).toISOString(),
    timezone: "Asia/Tokyo",
    frequency: { 
      type: "weekly", 
      repeats_every: 1, 
      on_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
};

export default DailyTrigger;

