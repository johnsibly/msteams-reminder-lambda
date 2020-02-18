const AWS = require(`aws-sdk`);
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
AWS.config.update({region: `eu-west-2`});

exports.handler = (event, context, callback) => {

    console.log(event);
    console.log('Entered msteams-reminders-put ' + event);

    const params = event.body;
    const TableName = "msteams-reminders";

    const Item = {  "lastTimeReminderExecuted": params.lastTimeReminderExecuted,
                    "cronInterval": params.cronInterval,
                    "reminderMessage": params.reminderMessage,
                    "teamsChannelWebhook": params.teamsChannelWebhook,
                    "id": params.id === undefined ? uuidv4() : params.id    
                 };
    dynamo.put({TableName, Item}, function (err, data) {
        if (err) {
            console.log(`error`, event + err);
            callback(event + err, null);
        } else {
            callback(null, Item);
        }
    });
};