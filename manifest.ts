import { Manifest } from "deno-slack-sdk/mod.ts";
import ManualWorkflow from "./workflows/ManualWorkflow.ts";
import DailyWorkflow from "./workflows/DailyWorkflow.ts";
import WeeklyWorkflow from "./workflows/WeeklyWorkflow.ts";
import MonthlyWorkflow from "./workflows/MonthlyWorkflow.ts";
import { CallFunctionDefinition } from "./functions/CallFunctionDefinition.ts";
import { CountChangesDefinition } from "./functions/CountChangesDefinition.ts";
import { CreateDealTableDefinition } from "./functions/CreateDealTableDefinition.ts";
import { ZendeskDealType } from "./types/zendesk_deal.ts";
import { ZendeskLeadType } from "./types/zendesk_lead.ts";
import { ZendeskContact } from "./types/zendesk_contact.ts";
import { ZendeskLeadConversion } from "./types/zendesk_conversion.ts"

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "zendesk-bot",
  description: "Extract lead and deal info daily at 8 AM JST from Zendesk API",
  icon: "assets/default_new_app_icon.png",
  workflows: [ManualWorkflow, DailyWorkflow, WeeklyWorkflow, MonthlyWorkflow],
  functions: [CallFunctionDefinition, CountChangesDefinition, CreateDealTableDefinition],
  outgoingDomains: ["api.getbase.com"],
  types: [ZendeskDealType, ZendeskLeadType, ZendeskContact, ZendeskLeadConversion],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "triggers:write",
  ],
});
