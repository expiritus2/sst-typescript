import * as sst from '@serverless-stack/resources';
import { HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Bucket, Table } from '@serverless-stack/resources';

export default class StorageStack extends sst.Stack {
    public bucket: Bucket;
    public table: Table;

    constructor(scope: sst.App, id: string, props?: sst.StackProps) {
        super(scope, id, props);

        this.bucket = new sst.Bucket(this, 'Uploads', {
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

        this.table = new sst.Table(this, 'Notes', {
            fields: {
                userId: sst.TableFieldType.STRING,
                noteId: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' }
        });
    }
}