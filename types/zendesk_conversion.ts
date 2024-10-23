import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const ZendeskLeadConversion = DefineType({
  title: "Zendesk Lead Conversion",
  description: "Information about the lead conversions from Zendesk",
  name: "zendesk_lead_conversion",
  type: Schema.types.object,
  properties: {
    id : {type: Schema.types.number },
    create_date: { type: Schema.types.string },
  },
  required: [],
});