import { ApiAuthorizationType, Stack, App, StackProps, Api, Table } from '@serverless-stack/resources';
import * as apigAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { IUserPool, IUserPoolClient } from "aws-cdk-lib/aws-cognito";

type LocalProps = {
    table: Table,
    userPool: IUserPool,
    userPoolClient: IUserPoolClient,
}

export default class ApiStack extends Stack {
    api: Api;

    constructor(scope: App, id: string, props?: StackProps & LocalProps) {
        super(scope, id, props);

        const { table, userPool, userPoolClient } = props as LocalProps;

        this.api = new Api(this, 'Api', {
            customDomain:
                scope.stage === "prod" ? "api.my-serverless-app.com" : undefined,
            defaultAuthorizationType: ApiAuthorizationType.JWT,
            defaultAuthorizer: new apigAuthorizers.HttpUserPoolAuthorizer("Authorizer", userPool, {
                userPoolClients: [userPoolClient],
            }),
            defaultFunctionProps: {
                environment: {
                    TABLE_NAME: table.tableName,
                    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
                }
            },
            cors: true,
            routes: {
                'POST /notes': {
                    function: 'backend/src/functions/create/lambda.main',
                    // authorizationType: ApiAuthorizationType.NONE,
                },
                'GET /notes/{id}': {
                    function: 'backend/src/functions/get/lambda.main',
                },
                'GET /notes': {
                    function: 'backend/src/functions/list/lambda.main',
                },
                'PUT /notes/{id}': {
                    function: 'backend/src/functions/update/lambda.main',
                },
                'DELETE /notes/{id}': {
                    function: 'backend/src/functions/delete/lambda.main',
                },
                'POST /billing': {
                    function: 'backend/src/functions/billing/lambda.main',
                },
            }
        });

        this.api.attachPermissions([table]);

        this.addOutputs({
            ApiEndpoint: this.api.customDomainUrl || this.api.url,
        });
    }
}