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

## Running locally

```sh
serverless invoke local -f process -l
```

🚢
## Deployment

```sh
serverless deploy -v
```

I used this icon for my reminder webhook
http://icons.iconarchive.com/icons/vexels/office/1024/alarm-clock-icon.png
