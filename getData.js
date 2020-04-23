const message = [];
const time = [];
const lastTime = [];
const text = document.getElementById("text");

async function getReminders() {
  const Reminders = axios.get('https://dlgoyn6ebc.execute-api.eu-west-2.amazonaws.com/prod/msteams-reminders')
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
}

getReminders();


// do i want to access every items key individually? i.e. all the reminderMessage then all the cronInterval? include lastTimeReminderExecuted?

// text.innerHTML += finalResult;

// Object.defineProperties(info).forEach

// console.log(typeof info)

// data.push(info)

// , console.log(JSON.stringify(item.reminderMessage))

// , console.log(JSON.stringify(item.cronInterval))

// , console.log(JSON.stringify(item.lastTimeReminderExecuted))