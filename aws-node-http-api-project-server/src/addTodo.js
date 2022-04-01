"use strict";
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const addTodo = async (event) => {
  try {
    const token = event.headers["Authorization"].split(" ")[1];
    const decoded = jwt.decode(token);
    const userId = decoded["cognito:username"];
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "*",
        "Access-Control-Allow-Headers":
          "X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS,PUT,DELETE",
      },
      body: JSON.stringify(newTodo),
    };
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports = {
  handler: middy(addTodo).use(httpJsonBodyParser()),
};
