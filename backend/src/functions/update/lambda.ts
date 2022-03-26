import apiHandler from "../../util/apiHandler";
import dynamoDb from "../../util/dynamodb";
import { LambdaBody } from '../../types/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const main = apiHandler(async (event: APIGatewayProxyEvent): Promise<LambdaBody> => {
    const data = JSON.parse(event.body || '');
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: process.env.TABLE_NAME!,
        // 'Key' defines the partition key and sort key of the item to be updated
        Key: {
            userId: event?.requestContext?.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
            noteId: event?.pathParameters?.id, // The id of the note from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":attachment": data.attachment || null,
            ":content": data.content || null,
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return { body: { status: true } };
});