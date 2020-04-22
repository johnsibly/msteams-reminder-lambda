const message = [];
const time = [];
const lastTime = [];
const text = document.getElementById("text");

function printMessages() {
  message.forEach(message => text.innerHTML += message);
}

function printTime() {
  time.forEach(time => text.innerHTML += time);
}

function printLastTimeExecuted() {
  lastTime.forEach(previous => text.innerHTML += previous);
}

async function getReminders() {
  const Reminders = axios.get('https://dlgoyn6ebc.execute-api.eu-west-2.amazonaws.com/prod/msteams-reminders')

  const response = await Reminders;

  const info = response.data.Items;
  
  console.log(info);

  info.forEach(item => message.push(item.reminderMessage))

  info.forEach(item => time.push(item.cronInterval))

  info.forEach(item => lastTime.push(item.lastTimeReminderExecuted))

  printMessages();
  printTime();
  printLastTimeExecuted()
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