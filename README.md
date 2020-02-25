# msteams-reminder-lambda

# Summary

Lambda(s) used to query a DynamoDB table for reminders (to water a plant for example), check based on CRON syntax whether the next reminder is due, and if so post a reminder to a pre-defined teams channel.
The Lambda *process* runs as a cron job every 5 minutes and performans all the business logic. As a result you can't set reminders more accuratly than every 5 minutes.
There are also Lambdas *get* and *put* for reading and writing reminders to DynamoDB.

## Installing

If not installed already, install the Serverless Framework

```sh
npm install -g serverless
```

Install dependencies

```sh
npm install
```

Currently you need to create a Dynamo db table manually called msteams-reminders, and a AIM role called LambdaDynamoDBAccess to allow access to the DB from the Lambda. I've also manually created API Gateway instances for the put and get lambdas at this stage.


## Running locally

```sh
serverless invoke local -f process -l
```

🚢
## Deployment

```sh
serverless deploy
```

## Adding reminders

Currently there are two options for adding reminders
1. If API Gateway is set up, you can send a PUT request to the PUT endpoint, specificing the CRON syntax, message, and webhookURL
2. Manually add an entry to DynamoDB (risky)

I recommend validating CRON syntax using https://crontab.guru/ beforehand to check it matches expections.

I used this icon for my reminder webhook
http://icons.iconarchive.com/icons/vexels/office/1024/alarm-clock-icon.png
