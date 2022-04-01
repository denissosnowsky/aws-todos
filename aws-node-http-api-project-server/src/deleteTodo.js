"use strict";
const AWS = require("aws-sdk");

const headers = require("../utils/headers");

const deleteTodo = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const { id } = event.pathParameters;

    let todo;

    const result = await dynamodb
      .delete({ TableName: "todosTable", Key: { id } })
      .promise();
    todo = result.Item;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(todo),
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
  handler: deleteTodo,
};
