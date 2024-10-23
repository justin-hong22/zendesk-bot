import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CallFunctionDefinition } from "../functions/CallFunctionDefinition.ts";
import { CountChangesDefinition } from "../functions/CountChangesDefinition.ts";
import { CreateDealTableDefinition } from "../functions/CreateDealTableDefinition.ts";

const MonthlyWorkflow = DefineWorkflow({
  callback_id: "monthly_workflow",
  title: "Monthly Trigger Workflow",
  description: "Extract Zendesk on the last day of the month at midnight automatically",
  input_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
    },
    required: ["channel"],
  },
});

const leads = MonthlyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "leads",
});

const deals = MonthlyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "deals",
});

const contacts = MonthlyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "contacts",
});

const lead_conversions = MonthlyWorkflow.addStep(CallFunctionDefinition, {
  info_type: "lead_conversions",
});

const changesCount = MonthlyWorkflow.addStep(CountChangesDefinition, {
  lead_info: leads.outputs.lead_info,
  deal_info: deals.outputs.deal_info,
  contact_info : contacts.outputs.contact_info,
  lead_conversion_info: lead_conversions.outputs.leadConversion_info,
});

const dealTable = MonthlyWorkflow.addStep(CreateDealTableDefinition, {
  deal_info: deals.outputs.deal_info,
});

MonthlyWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: MonthlyWorkflow.inputs.channel,
  message: 
    `Monthly Report\n` +
    `Leads with Activity: ${changesCount.outputs.leads_monthly}\n` +
    `Contacts Created: ${changesCount.outputs.created_contacts_monthly}\n` +  
    `Leads that have converted into contacts: ${changesCount.outputs.lead_conversions_monthly}\n` +
    `Contacts with Activity: ${changesCount.outputs.updated_contacts_monthly}\n` +
    `Deals Created: ${changesCount.outputs.dealsCreated_monthly}\n` +
    `Deals with Activity: ${changesCount.outputs.activityCount_monthly}\n` +
    `Deals with status change: ${changesCount.outputs.statusChangeCount_monthly}\n` +
    `Deals Won: ${changesCount.outputs.dealsWon_monthly}\n` +
    `Deals Lost: ${changesCount.outputs.dealsLost_monthly}\n` +
    `\n\n` +

    `The table below shows the deals that have some update this month. Deals with status of Lost is not shown\n` +
    `${dealTable.outputs.table_string}`
});

export default MonthlyWorkflow;