import * as sst from '@serverless-stack/resources';
import { ApiAuthorizationType } from '@serverless-stack/resources';

type LocalProps = {
    table: sst.Table,
}

export default class ApiStack extends sst.Stack {
    api: sst.Api;

    constructor(scope: sst.App, id: string, props?: sst.StackProps & LocalProps) {
        super(scope, id, props);

        const { table } = props as LocalProps;

        this.api = new sst.Api(this, 'Api', {
            customDomain:
                scope.stage === "prod" ? "api.my-serverless-app.com" : undefined,
            defaultAuthorizationType: ApiAuthorizationType.AWS_IAM,
            defaultFunctionProps: {
                environment: {
                    TABLE_NAME: table.tableName,
                    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
                }
            },
            cors: true,
            routes: {
                'POST /notes': 'backend/src/functions/create/lambda.main',
                'GET /notes/{id}': 'backend/src/functions/get/lambda.main',
                'GET /notes': 'backend/src/functions/list/lambda.main',
                'PUT /notes/{id}': 'backend/src/functions/update/lambda.main',
                'DELETE /notes/{id}': 'backend/src/functions/delete/lambda.main',
                'POST   /billing': 'backend/src/functions/billing/lambda.main',
            }
        });

        console.log(this.api.routes);

        this.api.attachPermissions([table]);

        this.addOutputs({
            ApiEndpoint: this.api.customDomainUrl || this.api.url,
        });
    }
}