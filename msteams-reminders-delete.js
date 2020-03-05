const AWS = require(`aws-sdk`);
const dynamo = new AWS.DynamoDB.DocumentClient();
AWS.config.update({region: `eu-west-2`});

exports.handler = (event, context, callback) => {
    const TableName = "msteams-reminders";

    const reminder = event.body;
    const Item = {"id": reminder.id};
    dynamo.deleteItem(Item, function(err, data) {
        if (err) {
            callback(`event: ${event}, err: ${err}`, null);
        }
        else {
            callback(null, Item);
        }
    });
};

