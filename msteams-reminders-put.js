const AWS = require(`aws-sdk`);
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
AWS.config.update({region: `eu-west-2`});

exports.handler = (event, context, callback) => {
    const TableName = "msteams-reminders";

    const reminder = event.body;
    const Item = {  "lastTimeReminderExecuted": !reminder.hasOwnProperty('lastTimeReminderExecuted') ? undefined : reminder.lastTimeReminderExecuted,
                    "cronInterval": reminder.cronInterval,
                    "reminderMessage": reminder.reminderMessage,
                    "teamsChannelWebhook": reminder.teamsChannelWebhook,
                    "id": reminder.id === undefined ? uuidv4() : reminder.id    
                };
    dynamo.put({TableName, Item}, function (err, data) {
        if (err) {
            callback(`event: ${event}, err: ${err}`, null);
        } else {
            callback(null, Item);
        }
    });
};