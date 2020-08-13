const AWS = require(`aws-sdk`);
const dynamo = new AWS.DynamoDB.DocumentClient();
AWS.config.update({region: `eu-west-2`});

exports.handler = (event, context, callback) => {
    console.info(event);
    const TableName = "msteams-reminders";

    const reminder = event.body;
    const item = {
        Key: {
          id: reminder.id
        },
        TableName: TableName,
    };

    dynamo.delete(item, function(err, data) {
        if (err) {
            callback(`event: ${event} ${reminder.id}, err: ${err}`, null);
        }
        else {
            callback(null, item);
        }
    });
};

