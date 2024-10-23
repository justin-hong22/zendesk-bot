import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { CountChangesDefinition } from "./CountChangesDefinition.ts";

function countDaily(date: string) 
{
  const now = new Date();
  const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));

  const date_formatted = new Date(String(date));
  return (date_formatted >= yesterday && date_formatted <= now) ? true : false;
}

function countWeekly(date: string) 
{
  const now = new Date();
  const daysSinceMonday = now.getDay() === 0 ? 6 : now.getDay() - 1; //count how many days has it been since Monday
  const monday = new Date(); //get the date of the most recent Monday at midnight
  monday.setDate(now.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);

  const date_formatted = new Date(String(date));
  return (date_formatted >= monday && date_formatted <= now) ? true : false;
}

function countMonthly(date: string) 
{
  const now = new Date();
  const date_formatted = new Date(String(date));
  return (date_formatted.getMonth() == now.getMonth() && date_formatted.getFullYear() == now.getFullYear()) ? true : false;
}

export default SlackFunction(
  CountChangesDefinition,
  ({ inputs }) => {

    //Dealing with LEADS here
    let leads_daily = 0;
    let leads_weekly = 0;
    let leads_monthly = 0;

    const leads = inputs.lead_info;
    for(let i = 0; i < leads.length; i++)
    {
      const update_date = String(leads[i].update_date);
      const status = leads[i].status?.toLowerCase();
      if(status != "unqualified")
      {
        if (countDaily(update_date)) leads_daily++;
        if (countWeekly(update_date)) leads_weekly++;
        if (countMonthly(update_date)) leads_monthly++;
      }
    }

    //Dealing with DEALS here
    let dealsCreated_daily = 0;
    let dealsCreated_weekly = 0;
    let dealsCreated_monthly = 0;

    let activityCount_daily = 0;
    let activityCount_weekly = 0;
    let activityCount_monthly = 0;

    let statusChangeCount_daily = 0;
    let statusChangeCount_weekly = 0;
    let statusChangeCount_monthly = 0;

    let dealsWon_daily = 0;
    let dealsWon_weekly = 0;
    let dealsWon_monthly = 0;

    let dealsLost_daily = 0;
    let dealsLost_weekly = 0;
    let dealsLost_monthly = 0;

    const deals = inputs.deal_info;
    for (let i = 0; i < deals.length; i++) 
    {
      const create_date = String(deals[i].create_date);
      if (countDaily(create_date)) dealsCreated_daily++;
      if (countWeekly(create_date)) dealsCreated_weekly++;
      if (countMonthly(create_date)) dealsCreated_monthly++;

      const update_date = String(deals[i].update_date);
      if (countDaily(update_date)) activityCount_daily++;
      if (countWeekly(update_date)) activityCount_weekly++;
      if (countMonthly(update_date)) activityCount_monthly++;

      const status_change_date = String(deals[i].change_date);
      if (countDaily(status_change_date)) statusChangeCount_daily++;
      if (countWeekly(status_change_date)) statusChangeCount_weekly++;
      if (countMonthly(status_change_date)) statusChangeCount_monthly++;

      const status = deals[i].status_name;
      if (status?.toLocaleLowerCase().includes("won") || status?.includes("内諾") || status?.includes("選定")) 
      {
        if (countDaily(status_change_date)) dealsWon_daily++;
        if (countWeekly(status_change_date)) dealsWon_weekly++;
        if (countMonthly(status_change_date)) dealsWon_monthly++;
      } 
      else if (status?.toLocaleLowerCase().includes("lost")) 
      {
        if (countDaily(status_change_date)) dealsLost_daily++;
        if (countWeekly(status_change_date)) dealsLost_weekly++;
        if (countMonthly(status_change_date)) dealsLost_monthly++;
      }
    }

    //Dealing with CONTACTS here
    let created_contacts_daily = 0;
    let created_contacts_weekly = 0;
    let created_contacts_monthly = 0;

    let updated_contacts_daily = 0;
    let updated_contacts_weekly = 0;
    let updated_contacts_monthly = 0;

    const contacts = inputs.contact_info;
    for(let i = 0; i < contacts.length; i++)
    {
      const contact_create_date = String(contacts[i].create_date);
      if (countDaily(contact_create_date)) created_contacts_daily++;
      if (countWeekly(contact_create_date)) created_contacts_weekly++;
      if (countMonthly(contact_create_date)) created_contacts_monthly++;
      
      const contact_update_date = String(contacts[i].update_date);
      if (countDaily(contact_update_date)) updated_contacts_daily++;
      if (countWeekly(contact_update_date)) updated_contacts_weekly++;
      if (countMonthly(contact_update_date)) updated_contacts_monthly++;
    }

    //Dealing with LEAD CONVERSIONS here
    let lead_conversions_daily = 0;
    let lead_conversions_weekly = 0;
    let lead_conversions_monthly = 0;

    const lead_conversions = inputs.lead_conversion_info;
    for(let i = 0; i < lead_conversions.length; i++)
    {
      const lc_create_date = String(lead_conversions[i].create_date);
      if (countDaily(lc_create_date)) lead_conversions_daily++;
      if (countWeekly(lc_create_date)) lead_conversions_weekly++;
      if (countMonthly(lc_create_date)) lead_conversions_monthly++;
    }
    
    return {
      outputs: 
      {
        leads_daily: leads_daily,
        leads_weekly: leads_weekly,
        leads_monthly: leads_monthly,

        dealsCreated_daily: dealsCreated_daily,
        dealsCreated_weekly: dealsCreated_weekly,
        dealsCreated_monthly: dealsCreated_monthly,

        activityCount_daily: activityCount_daily,
        activityCount_weekly: activityCount_weekly,
        activityCount_monthly: activityCount_monthly,

        statusChangeCount_daily: statusChangeCount_daily,
        statusChangeCount_weekly: statusChangeCount_weekly,
        statusChangeCount_monthly: statusChangeCount_monthly,

        dealsWon_daily: dealsWon_daily,
        dealsWon_weekly: dealsWon_weekly,
        dealsWon_monthly: dealsWon_monthly,

        dealsLost_daily: dealsLost_daily,
        dealsLost_weekly: dealsLost_weekly,
        dealsLost_monthly: dealsLost_monthly,

        created_contacts_daily: created_contacts_daily,
        created_contacts_weekly: created_contacts_weekly,
        created_contacts_monthly: created_contacts_monthly,

        updated_contacts_daily: updated_contacts_daily,
        updated_contacts_weekly: updated_contacts_weekly,
        updated_contacts_monthly: updated_contacts_monthly,

        lead_conversions_daily: lead_conversions_daily,
        lead_conversions_weekly: lead_conversions_weekly,
        lead_conversions_monthly: lead_conversions_monthly,
      },
    };
  },
);

