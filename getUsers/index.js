'use strict';
const AWS = require('aws-sdk');
const myRegion = "us-east-2";

AWS.config.update({ region: myRegion});

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: myRegion});

  let responseBody = "";
  let statusCode = 0;

  const params = {
    TableName: "Users"
  };

  try {
    const data = await documentClient.scan(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to get users: ${err}`;
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: responseBody
  };

  return response;
};