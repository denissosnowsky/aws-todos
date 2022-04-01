## Description

This is Todo pet project. In this application user can signin/signup via email, create, change, delete todos, change password.

The UI part was written using React and Typescript. 
The server part was written completely via aws services. Aws api gateway used for accepting http requests. Aws lambda functions on NodeJS platform used to be triggered by http requests. Aws cognito used for authentication. Aws S3 bucket used for application deploy. Also, Aws IAM and Aws cloudWatch services were used during the development.

## Local installation

### Step 1

#### `cd ./aws-node-http-api-project-client`

### Step 2

#### `yarn install`

### Step 3

#### `yarn start`

## Public installation

You can open the application using the link [http://aws-test-todo.s3-website-us-east-1.amazonaws.com/](http://aws-test-todo.s3-website-us-east-1.amazonaws.com/)