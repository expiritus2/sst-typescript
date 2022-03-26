import apiHandler from "../../util/apiHandler";
import dynamoDb from "../../util/dynamodb";
import * as AWS from 'aws-sdk';

// eslint-disable-next-line
export const main = apiHandler(async (event: any) => {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.TABLE_NAME!,
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        //   partition key
        KeyConditionExpression: "userId = :userId",
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be the id of the author
        ExpressionAttributeValues: {
            ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
        },
    };

    const result = await dynamoDb.query(params);

    // Return the matching list of items in response body
    return { body: result.Items };
});