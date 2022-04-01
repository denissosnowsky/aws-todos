"use strict";
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const headers = require("../utils/headers");
const parseTokenDateFromEvent = require("../utils/parseTokenDateFromEvent");

const addTodo = async (event) => {
  try {
    const decodedDataFromToken = parseTokenDateFromEvent(event);
    const userId = decodedDataFromToken["cognito:username"];
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { todo } = event.body;
    const createdAt = new Date().getTime();
    const id = v4();
    const newTodo = {
      id,
      todo,
      createdAt,
      completed: false,
      userId,
    };

    await dynamodb
      .put({
        TableName: "todosTable",
        Item: newTodo,
      })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(newTodo),
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
  handler: middy(addTodo).use(httpJsonBodyParser()),
};
