import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CallFunctionDefinition } from "../functions/CallFunctionDefinition.ts";
import { CountChangesDefinition } from "../functions/CountChangesDefinition.ts";
import { CreateDealTableDefinition } from "../functions/CreateDealTableDefinition.ts";

const WeeklyWorkflow = DefineWorkflow({
  callback_id: "weekly_workflow",
  title: "Weekly Trigger Workflow",
  description: "Extract Zendesk info every Thursday at midnight automatically",
  input_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
    },
    required: ["channel"],
  },
});

const leads = WeeklyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "leads",
});

const deals = WeeklyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "deals",
});

const contacts = WeeklyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "contacts",
});

const lead_conversions = WeeklyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "lead_conversions",
});

const changesCount = WeeklyWorkflow.addStep(CountChangesDefinition, {
  lead_info: leads.outputs.lead_info,
  deal_info: deals.outputs.deal_info,
  contact_info : contacts.outputs.contact_info,
  lead_conversion_info: lead_conversions.outputs.leadConversion_info,
});

const dealTable = WeeklyWorkflow.addStep(CreateDealTableDefinition, {
  deal_info: deals.outputs.deal_info,
});

WeeklyWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: WeeklyWorkflow.inputs.channel,
  message: 
    `Weekly Report\n` +
    `Leads with Activity: ${changesCount.outputs.leads_weekly}\n` +
    `Contacts Created: ${changesCount.outputs.created_contacts_weekly}\n` +  
    `Leads that have converted into contacts: ${changesCount.outputs.lead_conversions_weekly}\n` +
    `Contacts with Activity: ${changesCount.outputs.updated_contacts_weekly}\n` +
    `Deals Created: ${changesCount.outputs.dealsCreated_weekly}\n` +
    `Deals with Activity: ${changesCount.outputs.activityCount_weekly}\n` +
    `Deals with status change: ${changesCount.outputs.statusChangeCount_weekly}\n` +
    `Deals Won: ${changesCount.outputs.dealsWon_weekly}\n` +
    `Deals Lost: ${changesCount.outputs.dealsLost_weekly}\n` +
    `\n\n` +

    `The table below shows the deals that have some update this month. Deals with status of Lost is not shown\n` +
    `${dealTable.outputs.table_string}`
});

export default WeeklyWorkflow;