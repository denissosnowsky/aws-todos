import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_bypeHRAZq",
    ClientId: "4i715flom6oohdc4cg7l4gdo2p"
}

export default new CognitoUserPool(poolData);