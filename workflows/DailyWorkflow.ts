import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CallFunctionDefinition } from "../functions/CallFunctionDefinition.ts";
import { CountChangesDefinition } from "../functions/CountChangesDefinition.ts";

const DailyWorkflow = DefineWorkflow({
  callback_id: "daily_workflow",
  title: "Daily Trigger Workflow",
  description: "Extract Zendesk info every weekday at midnight automatically",
  input_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
    },
    required: ["channel"],
  },
});

const leads = DailyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "leads",
});

const deals = DailyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "deals",
});

const contacts = DailyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "contacts",
});

const lead_conversions = DailyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "lead_conversions",
});

const changesCount = DailyWorkflow.addStep(CountChangesDefinition, {
  lead_info: leads.outputs.lead_info,
  deal_info: deals.outputs.deal_info,
  contact_info : contacts.outputs.contact_info,
  lead_conversion_info: lead_conversions.outputs.leadConversion_info,
});

DailyWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: DailyWorkflow.inputs.channel,
  message: 
    `Daily Report\n` +
    `Leads with Activity: ${changesCount.outputs.leads_daily}\n` +
    `Contacts Created: ${changesCount.outputs.created_contacts_daily}\n` +  
    `Leads that have converted into contacts: ${changesCount.outputs.lead_conversions_daily}\n` +
    `Contacts with Activity: ${changesCount.outputs.updated_contacts_daily}\n` +
    `Deals Created: ${changesCount.outputs.dealsCreated_daily}\n` +
    `Deals with Activity: ${changesCount.outputs.activityCount_daily}\n` +
    `Deals with status change: ${changesCount.outputs.statusChangeCount_daily}\n` +
    `Deals Won: ${changesCount.outputs.dealsWon_daily}\n` +
    `Deals Lost: ${changesCount.outputs.dealsLost_daily}\n`
});

export default DailyWorkflow;