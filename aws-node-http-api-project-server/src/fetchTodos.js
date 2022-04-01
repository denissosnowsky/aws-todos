"use strict";
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

const fetchTodos = async (event) => {
  let todos;

  const token = event.headers["Authorization"].split(" ")[1];
  const decoded = jwt.decode(token);
  const userId = decoded["cognito:username"];
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
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
  } catch {
    console.log(error);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Requested-With": "*",
      "Access-Control-Allow-Headers":
        "X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods",
      "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
    },
    body: JSON.stringify(todos),
  };
};

module.exports = {
  handler: fetchTodos,
};
