import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const ZendeskContact = DefineType({
  title: "Zendesk Contact",
  description: "Information about the contacts from Zendesk",
  name: "zendesk_contact",
  type: Schema.types.object,
  properties: {
    id : {type: Schema.types.number },
    create_date: { type: Schema.types.string },
    update_date: { type: Schema.types.string },
  },
  required: [],
});