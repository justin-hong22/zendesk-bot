import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { ZendeskDealType } from "../types/zendesk_deal.ts";

export const CreateDealTableDefinition = DefineFunction({
  callback_id: "create_table",
  title: "Create Deal Table",
  description: "Formats the deals into a table",
  source_file: "functions/CreateDealTableHandler.ts",
  input_parameters: 
  {
    properties: 
    {
      deal_info: {
        type: Schema.types.array,
        items: { type: ZendeskDealType }, 
        description: "Array that holds an array that contains the deal info",
      },
    },
    required: ["deal_info"],
  },
  output_parameters: 
  {
    properties: 
    {
      table_string: {
        type: Schema.types.string,
        description: "The table that holds all of the deal info"
      },
    },

    required: [],
  },
});