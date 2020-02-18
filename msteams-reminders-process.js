const axios = require('axios');
const parser = require('cron-parser');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

exports.handler = function(event, context, callback){
    console.log('processing event: %j', event);

    let scanningParameters = {
        TableName: 'msteams-reminders',
        Limit: 1000 //maximum result of 1000 items
    };

    //In dynamoDB scan looks through your entire table and fetches all data
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
    let endDate = now;
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

      console.log(`datetime=${now} nextExecutionTime=${nextExecutionTime.value}`)

      if (nextDateTime <= now) {
        // we need to post to teams
        console.log(reminder.reminderMessage);
        reminder.lastTimeReminderExecuted = nextDateTime;
        
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

        const posted = await postReminderToTeams(reminder);

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
        activityTitle: `${reminder.reminderMessage}`,
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
