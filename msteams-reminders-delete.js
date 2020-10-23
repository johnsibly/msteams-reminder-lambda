const AWS = require(`aws-sdk`);
const dynamo = new AWS.DynamoDB.DocumentClient();
AWS.config.update({region: `eu-west-2`});

exports.handler = (event, context, callback) => {
    console.info(event);
    const TableName = "msteams-reminders";
    console.log(`event: ${JSON.stringify(event)}`);
    
    const reminder = {id: event.params.querystring.id};
    console.log(`reminder: ${JSON.stringify(reminder)}`);
    const item = {
        Key: {
          id: reminder.id
        },
        TableName: TableName,
    };

    console.log(`item: ${JSON.stringify(item)}`);

    dynamo.delete(item, function(err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, item);
        }
    });
};

