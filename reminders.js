// const parser = require('cron-parser');
const text = document.getElementById("text");
const remindersUrl = 'https://dlgoyn6ebc.execute-api.eu-west-2.amazonaws.com/prod/msteams-reminders';

async function getReminders() {
  const Reminders = axios.get(remindersUrl)
  const response = await Reminders;
  const info = response.data.Items;
  
  console.log(info);
  printTable(info);
}

function renderCellText(cellContent) {
  let newCell = document.createElement('td');
  newCell.innerText = cellContent;
  return newCell;
}

function renderButton(id) {
  let newCell = document.createElement('td');
  let button = document.createElement('BUTTON');
  button.name = id;
  button.onclick = function() {handleDelete(this.name)};
  button.innerHTML = 'Delete';
  newCell.append(button);
  return newCell;
}

function printTable(info) {
  const table = document.getElementById('reminders');
  info.forEach(function(item) {
    const row = document.createElement('tr');
    row.append(
      renderCellText(item.reminderMessage),
      renderCellText(item.cronInterval),
      renderCellText(item.lastTimeReminderExecuted),
      renderCellText(item.timeZone),
      renderButton(item.id)
    );
    table.append(row);
  });

  // addRowClickHandlers();
}

async function handleDelete(id) {
  console.log(id)
  if (confirm("Are you sure?")) {
    try {
      const reminder = {"body": {"id": id}};
      console.log(reminder);
      
      const response = await axios.delete(remindersUrl, {
        headers: {
          'content-type': 'application/json',
        },
        data: reminder
      });
      console.log(response);
      document.body.style.cursor = "wait";
      setTimeout(function(){ location.reload(); }, 2000);
    } catch (err) {
      throw new Error(err);
    }
  }
}

document.getElementById('submit').onclick = async function () {
  const message = document.getElementById("message").value;
  const cron = document.getElementById("cron").value;
  const timeZone = document.getElementById("timeZone").value;
  const webHookUrl = document.getElementById("webHookUrl").value;
  // const id = document.getElementById("id").value;

  if (message.length == 0 || cron.length == 0 || timeZone.length == 0 || webHookUrl.length == 0) {
    window.alert("All fields must contain a value");
    return;
  }

  try {
    const reminder = {"body": {"cronInterval": cron, "reminderMessage": message, "timeZone": timeZone, "teamsChannelWebhook": webHookUrl}};
    console.log(reminder);
    
    const response = await axios.put(remindersUrl, reminder, {
      headers: {
        'content-type': 'application/json',
      },
    });
    console.log(response);
    document.body.style.cursor = "wait";
    setTimeout(function(){ location.reload(); }, 2000);

  } catch (err) {
    throw new Error(err);
  }
}

function addRowClickHandlers() {
  const table = document.getElementById("reminders");
  const rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    let currentRow = table.rows[i];
    const createClickHandler = function(row) {
      return function() {
        const message = row.getElementsByTagName("td")[0].innerHTML;
        const cron = row.getElementsByTagName("td")[1].innerHTML;
        const lastTime = row.getElementsByTagName("td")[2].innerHTML;
        const timeZone = row.getElementsByTagName("td")[3].innerHTML;
        const id = row.getElementsByTagName("td")[4].innerHTML;

        console.log(`${message}, ${cron}, ${lastTime}, ${timeZone}, ${id}`);

        document.getElementById("message").value = message;
        document.getElementById("cron").value = cron;
        document.getElementById("timeZone").value = timeZone;
        document.getElementById("id").value = id;
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
  event.preventDefault();
}

function initialise() {
  getReminders();
}

initialise();

