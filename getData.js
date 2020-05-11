const message = [];
const time = [];
const lastTime = [];
const text = document.getElementById("text");
const remindersUrl = 'https://dlgoyn6ebc.execute-api.eu-west-2.amazonaws.com/prod/msteams-reminders';

async function getReminders() {
  const Reminders = axios.get(remindersUrl)
  const response = await Reminders;
  const info = response.data.Items;
  
  console.log(info);
  printTable(info);
}

function printTable(info) {
  let table = '<table style="width:100%" id="reminders">';
  table += '<tr>';
  table += '<th>Reminder Message</th>';
  table += '<th>Cron Interval</th>';
  table += '<th>Last Time Reminder Executed</th>';
  table += '<th>Timezone</th>';
  table += '</tr>';

  info.forEach(function(item) {
    table += `<tr>`;
    table += `<td>${item.reminderMessage}</td>`;
    table += `<td>${item.cronInterval}</td>`;
    table += `<td>${item.lastTimeReminderExecuted}</td>`;
    table += `<td>${item.timeZone}</td>`;
    table += `</tr>`;
  });
  table += '</table>';
  text.innerHTML += table;

  addHandlers();
}

function submit(event) {
  message = document.getElementById("message").value;
  cron = document.getElementById("cron").value;
  lastTime = document.getElementById("lastTime").value;
  timeZone = document.getElementById("timeZone").value;

  try {
    const reminder = {"body": {"cronInterval": cron, "reminderMessage": message, "timeZone": "Europe/London", "teamsChannelWebhook": "https://mywebhookurl"}};
    console.log(reminder);
    /*
    const response = await axios.put(remindersUrl, reminder, {
      headers: {
        'content-type': 'application/json',
      },
    });

    return `${response.status} - ${response.statusText}`;
    */
  } catch (err) {
    throw new Error(err);
  }
}

function addHandlers() {
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

        console.log(`${message}, ${cron}, ${lastTime}, ${timeZone}`);

        document.getElementById("message").value = message;
        document.getElementById("cron").value = cron;
        document.getElementById("lastTime").value = lastTime;
        document.getElementById("timeZone").value = timeZone;
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
  event.preventDefault();

  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('submit', submit);
}

function initialise() {
  getReminders();
  
}

initialise();

