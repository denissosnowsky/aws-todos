"use strict";
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const updateTodo = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { completed } = event.body;
    const { id } = event.pathParameters;
    
    await dynamodb
      .update({
        TableName: "todosTable",
        Key: { id },
        UpdateExpression: 'set completed = :completed',
        ExpressionAttributeValues: {
          ':completed': completed,
        },
        ReturnValues: 'ALL_NEW'
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
      body: JSON.stringify({
        msg: 'Todo updated'
      }),
    };
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports = {
  handler: middy(updateTodo).use(httpJsonBodyParser()),
};
