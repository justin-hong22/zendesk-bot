import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CallFunctionDefinition } from "../functions/CallFunctionDefinition.ts";
import { CountChangesDefinition } from "../functions/CountChangesDefinition.ts";
import { CreateDealTableDefinition } from "../functions/CreateDealTableDefinition.ts";

const ManualWorkflow = DefineWorkflow({
  callback_id: "manual_workflow",
  title: "Manual Trigger Workflow",
  description: "Creates the daily, weekly and monthly report at the same time when the trigger is invoked",
  input_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
    },
    required: ["channel"],
  },
});

const leads = ManualWorkflow.addStep(CallFunctionDefinition, {
  info_type: "leads",
});

const deals = ManualWorkflow.addStep(CallFunctionDefinition, {
  info_type: "deals",
});

const contacts = ManualWorkflow.addStep(CallFunctionDefinition, {
  info_type: "contacts",
});

const lead_conversions = ManualWorkflow.addStep(CallFunctionDefinition, {
  info_type: "lead_conversions",
});

const changesCount = ManualWorkflow.addStep(CountChangesDefinition, {
  lead_info: leads.outputs.lead_info,
  deal_info: deals.outputs.deal_info,
  contact_info : contacts.outputs.contact_info,
  lead_conversion_info: lead_conversions.outputs.leadConversion_info,
});

const dealTable = ManualWorkflow.addStep(CreateDealTableDefinition, {
  deal_info: deals.outputs.deal_info,
});

ManualWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: ManualWorkflow.inputs.channel,
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
    `Deals Lost: ${changesCount.outputs.dealsLost_daily}\n` +
    `\n\n` +

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

export default ManualWorkflow;
