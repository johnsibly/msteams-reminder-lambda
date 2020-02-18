const axios = require('axios');
const parser = require('cron-parser');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'}); //TODO: Move to config

exports.handler = function(event, context, callback){
    console.log('processing event: %j', event);

    let scanningParameters = {
        TableName: 'msteams-reminders',
        Limit: 1000
    };

    docClient.scan(scanningParameters, function(err,data){
        if(err){
            callback(err, null);
        }else{
            data.Items.forEach(item => processReminder(item));
            callback(null,data);
        }
    });
}

async function processReminder(reminder) {
    const now = new Date();
    let endDate = new Date(now);
    endDate.setHours(now.getHours()+1);
    
    let options = {
      currentDate: reminder.lastTimeReminderExecuted, 
      endDate: endDate,
      iterator: true
    };
    const interval = parser.parseExpression(reminder.cronInterval, options);

    try {
      let nextExecutionTime = interval.next();
      let nextDateTime = new Date(nextExecutionTime.value);
      if (nextDateTime <= now) {
        console.log(reminder.reminderMessage);
        reminder.lastTimeReminderExecuted = nextDateTime;
        
        await postReminderToTeams(reminder);
        
        const payload = {body: reminder};
        let lambda = new AWS.Lambda();
        let params = {
          FunctionName: 'msteams-reminders-dev-put', 
          Payload: JSON.stringify(payload)
        };
        
        lambda.invoke(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
      }

    } catch (e) {
      console.log(e);
    }
}


async function postReminderToTeams(reminder) {
  const card = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    summary: 'Reminder',
    sections: [
      {
        activityTitle: `⏰ Reminder: ${reminder.lastTimeReminderExecuted.toLocaleTimeString('en-GB').substring(0,5)} ⏰`,
      },
    ],
  };
  const result = { text: reminder.reminderMessage };
  card.sections.push(result);
  const posted = await postToTeams(card, reminder.teamsChannelWebhook);
  return posted;
}

async function postToTeams(card, teamsChannelWebhook) {
  console.log(card);
  if (teamsChannelWebhook === undefined) {
    console.log("teamsChannelWebhook is not set");
    return;
  }

  try {
    const response = await axios.post(teamsChannelWebhook, card, {
      headers: {
        'content-type': 'application/vnd.microsoft.teams.card.o365connector',
        'content-length': `${card.toString().length}`,
      },
    });
    return `${response.status} - ${response.statusText}`;
  } catch (err) {
    throw new Error(err);
  }
}
