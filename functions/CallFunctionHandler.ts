import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { CallFunctionDefinition } from "./CallFunctionDefinition.ts";

//Global Variables
const statusNames = new Map<number, string>();
const deals = new Map<number, {
  id: number;
  name: string;
  status_id: number;
  status_name: string;
  change_date: string;
  create_date: string;
  update_date: string;
}>();

const leads = new Map<number, {
  id: number;
  status: string;
  update_date: string;
}>();

const contacts = new Map<number, {
  id: number;
  create_date : string;
  update_date : string;
}>();

const lead_conversions  = new Map<number, {
  id: number;
  create_date : string;
}>();

async function getZendeskData(headers: {Accept: string; Authorization : string}, type : string)
{
  // deno-lint-ignore no-explicit-any
  let json: any[] = [];
  let pageNum = 1;
  let hasNextPage = true;

  while(hasNextPage)
  {
    const endpoint = "https://api.getbase.com/v2/" + type + "?page=" + pageNum + "&per_page=100";
    try
    {
      const data = await fetch(endpoint, {
        method: "GET",
        headers,
      }).then((res: Response) => {
        if (res.status === 200) return res.json();
        else throw new Error(`${res.status}: ${res.statusText}`);
      });

      if(data && data.items) {
        json = json.concat(data.items);
      }

      if(data.items.length < 100) {
        hasNextPage = false;
      }
      else {
        pageNum++;
      }

    } catch (err) {
      console.log(err);
      throw new Error(`An error was encountered while making Zendesk API call - \`${err.message}\``)
    }
  }

  return json;
}

//Gathering the stage names from their ids
async function getStageNames(headers: {Accept: string; Authorization : string})
{
  try
  {
    const stages = await getZendeskData(headers, "stages");
    for(let i = 0; i < stages.length; i++) 
    {
      const stage_id = stages[i].data.id;
      const stage_name = stages[i].data.name;
      statusNames.set(stage_id, stage_name);
    }        
  } catch (err) {
    console.log(err);
    throw new Error(`An error was encountered while getting Zendesk stage names - \`${err.message}\``)
  }
}

export default SlackFunction(
  CallFunctionDefinition,
  async ({ inputs, env }) => {
    const headers = {
      Accept: "application/json",
      Authorization: "Bearer " + env.ZENDESK_TOKEN,
    };

    try 
    {
      const now = new Date();

      // Getting all the leads in this loop
      if (inputs.info_type == "leads") 
      {
        const info = await getZendeskData(headers, "leads");
        
        for (let i = 0; i < info.length; i++) 
        {
          const entry = info[i].data;

          const lead_id = Number(entry.id);
          const status = String(entry.status);
          const update_at = String(entry.updated_at);

          const date = new Date(update_at);
          if(date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear() && date <= now)
          {
            leads.set(lead_id, {
              id: lead_id,
              status: status,
              update_date: update_at,
            });
          }
        }
      }

      else if (inputs.info_type == "deals") 
      {
        const info = await getZendeskData(headers, "deals");
        await getStageNames(headers);

        for (let i = 0; i < info.length; i++) 
        {
          const entry = info[i].data;

          const deal_id = entry.id;
          const deal_name = entry.name;
          const deal_stage_id = entry.stage_id;
          const deal_stage_name = String(statusNames.get(Number(deal_stage_id)));
          const status_change_date = String(entry.last_stage_change_at);
          const create_date = String(entry.created_at);
          const update_date = String(entry.updated_at);

          const date = new Date(update_date);
          if(date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear())
          {
            deals.set(deal_id, {
              id: deal_id,
              name: deal_name,
              status_id: deal_stage_id,
              status_name: deal_stage_name,
              change_date: status_change_date,
              create_date: create_date,
              update_date: update_date,
            });  
          }
        }
      }

      else if(inputs.info_type == "contacts")
      {
        const info = await getZendeskData(headers, "contacts");
        for(let i = 0; i < info.length; i++)
        {
          const contact_id = info[i].data.id;
          const create_date = String(info[i].data.created_at);
          const update_date = String(info[i].data.updated_at);

          contacts.set(contact_id, {
            id: contact_id,
            create_date: create_date,
            update_date: update_date,
          })
        }
      }

      else if(inputs.info_type == "lead_conversions")
      {
        const info = await getZendeskData(headers, "lead_conversions");
        for(let i = 0; i < info.length; i++)
        {
          lead_conversions.set(info[i].data.id, {
            id: info[i].data.id,
            create_date: String(info[i].data.created_at)
          })
        }
      }

      return {
        outputs: {
          lead_info: [...leads.entries()].map((r) => r[1]),
          deal_info: [...deals.entries()].map((r) => r[1]),
          contact_info: [...contacts.entries()].map((r) => r[1]),
          leadConversion_info: [...lead_conversions.entries()].map((r) => r[1])
        },
      };
    } catch (err) {
      console.log(err);
      return {
        error:
          `An error was encountered while getting Zendesk ` + inputs.info_type + ` - \`${err.message}\``,
      };
    }
  },
);
