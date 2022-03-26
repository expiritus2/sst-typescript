import * as debug from "./debug";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export default function apiHandler<T extends APIGatewayProxyEvent>(lambda: any) {
    return async function (event: T, context: Context): Promise<APIGatewayProxyResult> {
        let responseBody;
        let responseStatusCode;

        // Start debugger
        debug.init(event);

        try {
            // Run the Lambda
            const { body, statusCode = 200 } = await lambda(event, context);
            responseBody = body;
            responseStatusCode = statusCode;
        } catch (e: any) {
            // Print debug messages
            debug.flush(e);

            responseBody = { error: e.message };
            responseStatusCode = 500;
        }

        // Return HTTP response
        return {
            statusCode: responseStatusCode,
            body: JSON.stringify(responseBody),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    };
}