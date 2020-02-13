const AWS = require(`aws-sdk`);
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
AWS.config.update({region: `eu-west-2`});

exports.handler = (event, context, callback) => {

    console.log(event);

    const params = /* JSON.parse(*/ event.body; //);
    const TableName = "msteams-reminders";
    const Item = {};
    Item["lastTimeReminderExecuted"] = params.lastTimeReminderExecuted;
    Item["cronInterval"] = params.cronInterval;
    Item["reminderMessage"] = params.reminderMessage;
    Item["teamsChannelWebhook"] = params.teamsChannelWebhook;
    Item["id"] = uuidv4();

    dynamo.put({TableName, Item}, function (err, data) {
        if (err) {
            console.log(`error`, event + err);
            callback(event + err, null);
        } else {
            var response = {
                statusCode: 200,
                headers: {
                    'Content-Type': `application/json`,
                    'Access-Control-Allow-Methods': `GET,POST,OPTIONS`,
                    'Access-Control-Allow-Origin': '*', // `https://my-domain.com`,
                    'Access-Control-Allow-Credentials': `true`
                },
                isBase64Encoded: false
            };
            console.log(`success: returned ${data.Item}`);
            callback(null, response);
        }
    });
};