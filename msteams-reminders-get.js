const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'}); //TODO: Move to config

exports.handler = function(event, context, callback){
    let scanningParameters = {
        TableName: 'msteams-reminders',
        Limit: 1000
    };

    docClient.scan(scanningParameters, function(err,data){
        if(err){
            callback(err, null);
        }else{
          data.Items.forEach(item => delete item.teamsChannelWebhook);
          callback(null,data);
        }
    });
}
