import apiHandler from "../../util/apiHandler";
import dynamoDb from "../../util/dynamodb";
import * as AWS from 'aws-sdk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const main = apiHandler(async (event: any) => {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        TableName: process.env.TABLE_NAME!,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        Key: {
            userId: event.requestContext.authorizer.jwt.claims.username || event.requestContext.authorizer.jwt.claims['cognito:username'], // The id of the author
            noteId: event.pathParameters.id, // The id of the note from the path
        },
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("Item not found!");
    }

    // Return the retrieved item
    return { body: [] };
});