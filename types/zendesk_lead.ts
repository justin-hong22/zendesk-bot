import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const ZendeskLeadType = DefineType({
  title: 'Zendesk Lead',
  description: 'Leads extracted from Zendesk API',
  name: 'zendesk_lead',
  type: Schema.types.object,
  properties: {
    id: {type: Schema.types.number },
    status: {type: Schema.types.string},
    update_date: {type: Schema.types.string},
  },
  required: [],
});