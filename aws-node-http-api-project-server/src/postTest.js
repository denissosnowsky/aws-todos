"use strict";
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const postTest = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    /* const { email } = event.body; */
    const createdAt = new Date().toISOString();
    const id = v4();

    const newUser = {
      id,
      email: 'testEmail',
      createdAt,
    };

    await dynamodb
      .put({
        TableName: "usersTable",
        Item: newUser,
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "*",
        "Access-Control-Allow-Headers": "X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS"
      },
      body: JSON.stringify(newUser),
    };
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports = {
  handler: middy(postTest).use(httpJsonBodyParser()),
};
