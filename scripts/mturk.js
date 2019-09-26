const AWS = require('aws-sdk');

require('dotenv').config();

const {
  MTURK_AWS_ACCESS_KEY_ID,
  MTURK_AWS_SECRET_ACCESS_KEY,
  MTURK_NODE_ENV,
  MTURK_LOCALE,
  MTURK_CONTRACTOR,
  MTURK_LIFETIME_DAYS,
  MTURK_HIT_DURATION_MINUTES,
  MTURK_DESCRIPTION,
  MTURK_REWARD,
  MTURK_TITLE,
  MTURK_KEYWORDS,
  MTURK_MAX_ASSIGNMENTS,
} = process.env;

AWS.config = {
  accessKeyId: MTURK_AWS_ACCESS_KEY_ID,
  secretAccessKey: MTURK_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
  sslEnabled: 'true',
};

const isProd = MTURK_NODE_ENV === 'prod';

const mturkEndpointProd = 'https://mturk-requester.us-east-1.amazonaws.com';
const mturkEndpointDev =
  'https://mturk-requester-sandbox.us-east-1.amazonaws.com';

const endpoint = isProd ? mturkEndpointProd : mturkEndpointDev;

const mturk = new AWS.MTurk({ endpoint });

// This will return $10,000.00 in the MTurk Developer Sandbox
mturk.getAccountBalance((err, data) => {
  console.log('The Account Balance is:', data.AvailableBalance);
});

// https://docs.aws.amazon.com/AWSMechTurk/latest/AWSMturkAPI/ApiReference_SchemaLocationArticle.html
const externalQuestionSchema =
  'http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd';
const externalUrlProd = `https://commonvoice.bespoken.tools/${MTURK_LOCALE}/speak?contractor=${MTURK_CONTRACTOR}`;
// this should be commonvoice-dev
const externalUrlDev = `https://commonvoice.bespoken.tools/${MTURK_LOCALE}/speak?contractor=${MTURK_CONTRACTOR}`;

const externalEndpoint = isProd ? externalUrlProd : externalUrlDev;

const externalQuestion = `<?xml version="1.0" encoding="UTF-8"?>
<ExternalQuestion xmlns="${externalQuestionSchema}">
  <ExternalURL>${externalEndpoint}</ExternalURL>
  <FrameHeight>0</FrameHeight>
</ExternalQuestion>`;

const lifetimeInSeconds = 3600 * 24 * parseInt(MTURK_LIFETIME_DAYS);
const assignmentDurationInSeconds = 60 * parseInt(MTURK_HIT_DURATION_MINUTES);
const maxAssignments = parseInt(MTURK_MAX_ASSIGNMENTS);

const params = {
  AssignmentDurationInSeconds: assignmentDurationInSeconds,
  Description: MTURK_DESCRIPTION,
  LifetimeInSeconds: lifetimeInSeconds,
  Reward: MTURK_REWARD,
  Title: MTURK_TITLE,
  Keywords: MTURK_KEYWORDS,
  MaxAssignments: maxAssignments,
  Question: externalQuestion,
};

mturk.createHIT(params, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
  }
});