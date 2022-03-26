import * as AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

export default {
    get: (params: AWS.DynamoDB.DocumentClient.GetItemInput): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> => client.get(params).promise(),
    put: (params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> => client.put(params).promise(),
    query: (params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> => client.query(params).promise(),
    update: (params: AWS.DynamoDB.DocumentClient.UpdateItemInput): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> => client.update(params).promise(),
    delete: (params: AWS.DynamoDB.DocumentClient.DeleteItemInput): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> => client.delete(params).promise(),
};