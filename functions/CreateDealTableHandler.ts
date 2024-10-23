import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { CreateDealTableDefinition } from "./CreateDealTableDefinition.ts";

function formatDate(date : string) : string
{
  const date_formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",    
    hour: "2-digit",   
    minute: "2-digit", 
    hour12: false, 
  }).format(new Date(String(date)));

  return date_formatted;
}

function getPaddingCount(str : string) : number
{
  const padding = (str.toLocaleLowerCase().includes("won") || str.toLocaleLowerCase().includes("unqualified") ||
    str.toLocaleLowerCase().includes("lost")) ? 17 : 15;
  
  return padding;
}

export default SlackFunction(
  CreateDealTableDefinition,
  ({ inputs }) => 
  {  
    const deals = inputs.deal_info;

    //Creating the deal table here
    const column1 = "#";
    const column2 = "Last Status Change";
    const column3 = "Current Status";
    const column4 = "Deal Name";

    let table = "\`\`\`";
    table += column1.padEnd(8, ' ') + column2.padEnd(25, ' ') + column3.padEnd(25, ' ') + column4 + "\n";

    //Filling the deal table here
    let rowNum = 1;
    for(let i = 0; i < deals.length; i++)
    {
      const change_date = formatDate(String(deals[i].change_date));
      const status = String(deals[i].status_name);
      const name = String(deals[i].name);

      //Avoid printing the deals that are NOT lost
      const s_padding = getPaddingCount(status);
      if(!String(status).toLocaleLowerCase().includes("lost")) 
      {
        const row = `${String(rowNum).padEnd(8, ' ')}${change_date + ' '.repeat(8)}${status?.padEnd(s_padding, '　')}${name}\n`;
        table += row;
        rowNum++;
      }
    }
  
    table += "\`\`\`";
    
    //Check to see if there were any rows added to table
    if(rowNum == 1) 
    {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const currMonth = new Date().getMonth();

      table = "\`\`\`No active deals have changed status since " + monthNames[currMonth] + " 1st, " + new Date().getFullYear() + "\`\`\`";
    }

    return {
      outputs: {
        table_string: table,
      }
    }
  }
);
