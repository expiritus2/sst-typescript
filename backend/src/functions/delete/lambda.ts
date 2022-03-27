import apiHandler from "../../util/apiHandler";
import dynamoDb from "../../util/dynamodb";

export const main = apiHandler(async (event: any) => {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: process.env.TABLE_NAME!,
        // 'Key' defines the partition key and sort key of the item to be removed
        Key: {
            userId: event.requestContext.authorizer.jwt.claims.username || event.requestContext.authorizer.jwt.claims['cognito:username'], // The id of the author
            noteId: event.pathParameters.id, // The id of the note from the path
        },
    };

    await dynamoDb.delete(params);

    return { body: { status: true } };
});