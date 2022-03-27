import { Stack, StackProps, App, TableFieldType } from '@serverless-stack/resources';
import { HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Bucket, Table } from '@serverless-stack/resources';

export default class StorageStack extends Stack {
    public bucket: Bucket;
    public table: Table;

    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        this.bucket = new Bucket(this, 'Uploads', {
            s3Bucket: {
                // Allow client side access to the bucket from a different domain
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                        allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE, HttpMethods.DELETE],
                    },
                ],
            },
        });

        this.table = new Table(this, 'Notes', {
            fields: {
                userId: TableFieldType.STRING,
                noteId: TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' }
        });
    }
}