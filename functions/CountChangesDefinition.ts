import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { ZendeskLeadType } from "../types/zendesk_lead.ts";
import { ZendeskDealType } from "../types/zendesk_deal.ts";

export const CountChangesDefinition = DefineFunction({
  callback_id: "count_changes",
  title: "Count Deal Changes",
  description: "Count the daily, weekly and monthly changes for deals",
  source_file: "functions/CountChangesHandler.ts",
  input_parameters: {
    properties: {
      lead_info: {
        type: Schema.types.array,
        items: { type: ZendeskLeadType },
        description: "Array that holds an array that contains the lead info",
      },

      deal_info: {
        type: Schema.types.array,
        items: { type: ZendeskDealType },
        description: "Array that holds an array that contains the deal info",
      },

      contact_info: {
        type: Schema.types.array,
        items: { type: ZendeskDealType },
        description: "Array that holds an array that contains the contact info",
      },

      lead_conversion_info : {
        type: Schema.types.array,
        items: { type: ZendeskDealType },
        description: "Array that holds an array that contains the lead conversions info",
      },

    },
    required: ["lead_info", "deal_info", "contact_info", "lead_conversion_info"],
  },
  output_parameters: {
    properties: {
      leads_daily: { type: Schema.types.number },
      leads_weekly: { type: Schema.types.number },
      leads_monthly: { type: Schema.types.number },

      dealsCreated_daily: { type: Schema.types.number },
      dealsCreated_weekly: { type: Schema.types.number },
      dealsCreated_monthly: { type: Schema.types.number },

      activityCount_daily: { type: Schema.types.number },
      activityCount_weekly: { type: Schema.types.number },
      activityCount_monthly: { type: Schema.types.number },

      statusChangeCount_daily: { type: Schema.types.number },
      statusChangeCount_weekly: { type: Schema.types.number },
      statusChangeCount_monthly: { type: Schema.types.number },

      dealsWon_daily: { type: Schema.types.number },
      dealsWon_weekly: { type: Schema.types.number },
      dealsWon_monthly: { type: Schema.types.number },

      dealsLost_daily: { type: Schema.types.number },
      dealsLost_weekly: { type: Schema.types.number },
      dealsLost_monthly: { type: Schema.types.number },

      created_contacts_daily: { type: Schema.types.number },
      created_contacts_weekly: { type: Schema.types.number },
      created_contacts_monthly: { type: Schema.types.number },

      updated_contacts_daily: { type: Schema.types.number },
      updated_contacts_weekly: { type: Schema.types.number },
      updated_contacts_monthly: { type: Schema.types.number },

      lead_conversions_daily: { type: Schema.types.number },
      lead_conversions_weekly: { type: Schema.types.number },
      lead_conversions_monthly: { type: Schema.types.number },
    },
    required: [],
  },
});
