"use strict";
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const headers = require("../utils/headers");

const addUser = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { email } = event.body;
    const createdAt = new Date().toISOString();
    const id = v4();

    const newUser = {
      id,
      email,
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
      headers,
      body: JSON.stringify(newUser),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
  }
};

module.exports = {
  handler: middy(addUser).use(httpJsonBodyParser()),
};
