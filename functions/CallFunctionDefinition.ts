import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { ZendeskDealType } from "../types/zendesk_deal.ts";
import { ZendeskLeadType } from "../types/zendesk_lead.ts";
import { ZendeskContact } from "../types/zendesk_contact.ts";
import { ZendeskLeadConversion } from "../types/zendesk_conversion.ts";

export const CallFunctionDefinition = DefineFunction({
  callback_id: "call_function",
  title: "Zendesk API Call",
  description: "Actually make the API call to Zendesk",
  source_file: "functions/CallFunctionHandler.ts",
  input_parameters: 
  {
    properties: 
    {
      info_type: {
        type: Schema.types.string,
        description: "Endpoint type to get from - either leads or deals",
      },
    },
    required: ["info_type"],
  },
  output_parameters: 
  {
    properties: 
    {
      lead_info: {
        type: Schema.types.array,
        items: { type: ZendeskLeadType }, 
        description: "Array containinng lead info from Zendesk API",
      },

      deal_info: {
        type: Schema.types.array,
        items: { type: ZendeskDealType }, 
        description: "Array that holds an array that contains the deal info",
      },

      contact_info: {
        type: Schema.types.array,
        items: { type: ZendeskContact }, 
        description: "Array that holds an array that contains the contact info",
      },

      leadConversion_info: {
        type: Schema.types.array,
        items: { type: ZendeskLeadConversion }, 
        description: "Array that holds an array that contains the lead conversion info",
      },
    },
    required: [],
  },
});
