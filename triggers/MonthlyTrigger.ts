import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import MonthlyWorkflow from "../workflows/MonthlyWorkflow.ts";

const MonthlyTrigger: ScheduledTrigger<typeof MonthlyWorkflow.definition> = {
  name: "Zendesk API Monthly Report Trigger",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${MonthlyWorkflow.definition.callback_id}`,
  inputs: {
    channel: {
      value: "C01RA2QC03S", //CHANGE ME
    },
  },
  schedule: {
    start_time: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 2, 0, 0, 0).toISOString(),
    timezone: "Asia/Tokyo",
    frequency: { 
      type: "monthly", 
      repeats_every: 1,
    },
  },
};

export default MonthlyTrigger;

