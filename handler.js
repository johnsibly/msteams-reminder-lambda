'use strict';
const moment = require("moment");
const dotenv = require('dotenv');
const axios = require('axios');
const parser = require('cron-parser');

// require and configure dotenv, will load vars from .env into PROCESS.ENV
dotenv.config();

module.exports.processReminders = async (event, context) => {
  var allKeys = [];
  function listAllKeys(token, cb)
  {
    var opts = { Bucket: s3bucket };
    if(token) opts.ContinuationToken = token;
  
    s3.listObjectsV2(opts, function(err, data){
      allKeys = allKeys.concat(data.Contents);
  
      if(data.IsTruncated)
        listAllKeys(data.NextContinuationToken, cb);
      else
        cb();
    });
  }
  
  let object = s3.getObject({
    Bucket: srcBucket,
    Key: srcKey
  }, next);

  // this would come from JSON file on S3 bucket
  let lastTimeRun = new Date('Tue, 25 Dec 2012 12:15:00 UTC');
  let interval = parser.parseExpression('0 15 * ? * *', options);
  let reminderMessage = 'Reminder to water the plant';
  let teamsChannelWebhook = 'https://abc';

  const endDate = new Date('Wed, 27 Dec 2012 14:20:00 UTC');
  for (let dateTime = new Date('Wed, 26 Dec 2012 14:10:00 UTC'); dateTime < endDate; dateTime.setMinutes(dateTime.getMinutes()+5)) {

    var options = {
      currentDate: lastTimeRun,
      endDate: endDate,
      iterator: true
    };

    var interval = parser.parseExpression('0 15 * ? * *', options);

    try {

      var nextExecutionTime = interval.next();
      let nextDateTime = new Date(nextExecutionTime.value);

      console.log(`datetime=${dateTime} nextExecutionTime=${nextDateTime}`)

      if (nextDateTime <= dateTime) {
        // we need to post to teams
        console.log(reminderMessage);
        // update lastTIme run in s3 JSON file
        lastTimeRun = nextDateTime;
        // putObjectToS3()
      }

    } catch (e) {
      console.log(e);
      break;
    }
  }
}

const postReportToTeams = async function(reminder, text) {
  const card = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    summary: 'Reminder',
    sections: [
      {
        activityTitle: `${reminder}`,
      },
    ],
  };
  const result = { text };
  card.sections.push(result);
  const posted = await postToTeams(card);
  return posted;
}

async function postToTeams(card) {
  console.log(card);
  if (process.env.TEAMS_WEBHOOK_URL === undefined) {
    console.log("process.env.TEAMS_WEBHOOK_URL is not set");
    return;
  }

  try {
    const response = await axios.post(process.env.TEAMS_WEBHOOK_URL, card, {
      headers: {
        'content-type': 'application/vnd.microsoft.teams.card.o365connector',
        'content-length': `${card.toString().length}`,
      },
    });
    return `${response.status} - ${response.statusText}`;
  } catch (err) {
    throw new Error(err);
  }
}

var AWS = require('aws-sdk');
function putObjectToS3(bucket, key, data){
  var s3 = new AWS.S3();
    var params = {
      Bucket : bucket,
      Key : key,
      Body : data
    }
    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
}