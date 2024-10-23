import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import WeeklyWorkflow from "../workflows/WeeklyWorkflow.ts";

const WeeklyTrigger: ScheduledTrigger<typeof WeeklyWorkflow.definition> = {
  name: "Zendesk API Weekly Report Trigger",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${WeeklyWorkflow.definition.callback_id}`,
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
      on_days: ["Thursday"] 
    },
  },
};

export default WeeklyTrigger;

