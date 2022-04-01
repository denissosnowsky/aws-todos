"use strict";
const AWS = require("aws-sdk");

const deleteTodo = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  let todo;

  try {
    const result = await dynamodb.delete({ TableName: "todosTable", Key: { id } }).promise();
    todo = result.Item;
  } catch {
    console.log(error);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Requested-With": "*",
      "Access-Control-Allow-Headers": "X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods",
      "Access-Control-Allow-Methods": "POST,GET,DELETE,OPTIONS"
    },
    body: JSON.stringify(todo),
  };
};

module.exports = {
  handler: deleteTodo,
};
