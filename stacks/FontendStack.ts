import { Bucket, StackProps, Stack, App, Api, ReactStaticSite } from "@serverless-stack/resources";
import * as path from 'path';
import { CfnIdentityPool, IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';

type LocalProps = {
    userPool: IUserPool;
    userPoolClient: IUserPoolClient;
    cognitoCfnIdentityPool: CfnIdentityPool;
    api: Api;
    bucket: Bucket;
}

export default class FrontendStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps & LocalProps) {
        super(scope, id, props);

        const { api, userPool, userPoolClient, bucket, cognitoCfnIdentityPool } = props as LocalProps;

        // Define our React app
        const site = new ReactStaticSite(this, "ReactSite", {
            customDomain:
                scope.stage === "prod"
                    ? {
                        domainName: "my-serverless-app.com",
                        domainAlias: "www.my-serverless-app.com",
                    }
                    : undefined,
            path: path.resolve(__dirname, '..', '..', 'frontend'),
            // Pass in our environment variables
            environment: {
                REACT_APP_API_URL: api.customDomainUrl || api.url,
                REACT_APP_REGION: scope.region,
                REACT_APP_BUCKET: bucket.bucketName,
                REACT_APP_USER_POOL_ID: userPool.userPoolId,
                REACT_APP_IDENTITY_POOL_ID: cognitoCfnIdentityPool.ref,
                REACT_APP_USER_POOL_CLIENT_ID: userPoolClient.userPoolClientId,
            },
        });

        // Show the url in the output
        this.addOutputs({
            SiteUrl: site.customDomainUrl || site.url,
        });
    }
}