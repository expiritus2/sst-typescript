import * as uuid from "uuid";
import apiHandler from "../../util/apiHandler";
import dynamoDb from "../../util/dynamodb";
import * as AWS from 'aws-sdk';

type CreateBody = {
    content: string;
    attachment: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const main = apiHandler(async (event: any) => {
    const data = JSON.parse(event.body) as CreateBody;
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        TableName: process.env.TABLE_NAME!,
        Item: {
            // The attributes of the item to be created
            userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
            noteId: uuid.v1(), // A unique uuid
            content: data.content, // Parsed from request body
            attachment: data.attachment, // Parsed from request body
            createdAt: Date.now(), // Current Unix timestamp
        },
    };

    await dynamoDb.put(params);

    return { body: params.Item };
});