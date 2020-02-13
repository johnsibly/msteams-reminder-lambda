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

function processReminder(reminder) {
    const now = new Date();
    let endDate = now;
    endDate.setHours(now.getHours()+1);
    
    let options = {
      currentDate: reminder.lastTimeReminderExecuted,
      endDate: endDate,
      iterator: true
    };

    let interval = parser.parseExpression(reminder.cronInterval, options);

    try {
      let nextExecutionTime = interval.next();
      let nextDateTime = new Date(nextExecutionTime.value);

      console.log(`datetime=${now} nextExecutionTime=${nextExecutionTime.value}`)

      if (nextDateTime <= now) {
        // we need to post to teams
        console.log(reminder.reminderMessage);
        reminder.lastTimeReminderExecuted = nextDateTime;
        
        let lambda = new AWS.Lambda();
        let params = {
          FunctionName: 'msteams-reminders-add', // this lambda is incorrectly named - is actually is doing a put operation 
          Payload: JSON.stringify(reminder)
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