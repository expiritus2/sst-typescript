import * as util from "util";
import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent } from 'aws-lambda';

let logs: any = [];

// Log AWS SDK calls
AWS.config.logger = { log: debug };

export default function debug(...args: any) {
    logs.push({
        date: new Date(),
        string: util.format.apply(null, args),
    });
}

export function init<T extends APIGatewayProxyEvent>(event: T) {
    logs = [];

    // Log API event
    debug("API event", {
        body: event.body,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
    });
}

export function flush(e: Error) {
    logs.forEach(({ date, string }: { date: any; string: string }) => console.debug(date, string));
    console.error(e);
}