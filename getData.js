function createTable (info) {
  const table = document.getElementById ('reminders');
  info.forEach (item => {
    let newRow = document.createElement ('tr');
    let newCell1 = document.createElement ('td');
    let newCell2 = document.createElement ('td');
    let newCell3 = document.createElement ('td');
    newCell1.innerText = item.reminderMessage;
    newCell2.innerText = item.cronInterval;
    newCell3.innerText = item.lastTimeReminderExecuted;
    newRow.append (newCell1);
    newRow.append (newCell2);
    newRow.append (newCell3);
    table.append (newRow);
  });
}

async function getInfo() {
  const Reminders = axios.get (
    'https://dlgoyn6ebc.execute-api.eu-west-2.amazonaws.com/prod/msteams-reminders'
  );
  const response = await Reminders;
  const info = response.data.Items;
  return info;
}

async function getReminders() {
  const info = await getInfo()
  createTable(info);
}
getReminders();
