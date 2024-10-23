import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const ZendeskDealType = DefineType({
  title: "Zendesk Deal",
  description: "Information about the deals from Zendesk",
  name: "zendesk_deal",
  type: Schema.types.object,
  properties: {
    id : {type: Schema.types.number },
    name: { type: Schema.types.string },
    status_id: { type: Schema.types.number },
    status_name: {type: Schema.types.string},
    change_date: { type: Schema.types.string },
    create_date: { type: Schema.types.string },
    update_date: {type: Schema.types.string},
  },
  required: [],
});