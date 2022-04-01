"use strict";
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const headers = require("../utils/headers");

const updateTodo = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { completed } = event.body;
    const { id } = event.pathParameters;

    await dynamodb
      .update({
        TableName: "todosTable",
        Key: { id },
        UpdateExpression: "set completed = :completed",
        ExpressionAttributeValues: {
          ":completed": completed,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        msg: "Todo updated",
      }),
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
  handler: middy(updateTodo).use(httpJsonBodyParser()),
};
