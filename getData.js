"use strict";
require("babel-core/register");
require("babel-polyfill");

function renderCellText(cellContent) {
  let newCell1 = document.createElement('td');
  newCell1.innerText = cellContent;
  return newCell1;
}

function createTable(info) {
  const table = document.getElementById('reminders');
  info.forEach(item => {
    let newRow = document.createElement('tr');
    newRow.append(
      renderCellText(item.reminderMessage),
      renderCellText(item.cronInterval),
      renderCellText(item.lastTimeReminderExecuted)
    );
    table.append(newRow);
  });
}

async function getInfo() {
  const Reminders = axios.get(
    'https://dlgoyn6ebc.execute-api.eu-west-2.amazonaws.com/prod/msteams-reminders'
  );
  const response = await Reminders;
  const info = response.data.Items;
  return info;
}

async function getReminders() {
  const info = await getInfo();
  createTable(info);
}
getReminders();
