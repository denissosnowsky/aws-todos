"use strict";
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

const headers = require("../utils/headers");
const parseTokenDateFromEvent = require("../utils/parseTokenDateFromEvent");

const fetchTodos = async (event) => {
  try {
  let todos;

  const decodedDataFromToken = parseTokenDateFromEvent(event);
  const userId = decodedDataFromToken["cognito:username"];
  const dynamodb = new AWS.DynamoDB.DocumentClient();

    const results = await dynamodb
      .scan({
        TableName: "todosTable",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    todos = results.Items;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(todos),
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
  }
};

module.exports = {
  handler: fetchTodos,
};
