/**
 * 対象のユーザ情報を更新する
 */
'use strict';
const AWS = require('aws-sdk');
const myRegion = "us-east-2";

AWS.config.update({ region: myRegion});

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: myRegion});

  let responseBody = "";
  let statusCode = 0;

  const { id, firstname, lastname } = JSON.parse(event.body);

  const params = {
    TableName: "Users",
    Key: {
        id: id
    },
    UpdateExpression: "set firstname = :fname, lastname = :lname",
    ExpressionAttributeValues: {
        ":fname": firstname,
        ":lname": lastname
    },
    ReturnValues: "UPDATED_NEW"
  };

  try {
    const data = await documentClient.update(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 204;
  } catch (err) {
    responseBody = `Unable to patch user ${err}`;
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