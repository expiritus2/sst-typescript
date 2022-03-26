import * as sst from "@serverless-stack/resources";
import * as path from 'path';

type LocalProps = {
    api: sst.Api;
    auth: sst.Auth;
    bucket: sst.Bucket;
}

export default class FrontendStack extends sst.Stack {
    constructor(scope: sst.App, id: string, props?: sst.StackProps & LocalProps) {
        super(scope, id, props);

        const { api, auth, bucket } = props as LocalProps;

        // Define our React app
        const site = new sst.ReactStaticSite(this, "ReactSite", {
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
                REACT_APP_USER_POOL_ID: auth.cognitoUserPool!.userPoolId,
                REACT_APP_IDENTITY_POOL_ID: auth.cognitoCfnIdentityPool.ref,
                REACT_APP_USER_POOL_CLIENT_ID: auth.cognitoUserPoolClient!.userPoolClientId,
            },
        });

        // Show the url in the output
        this.addOutputs({
            SiteUrl: site.customDomainUrl || site.url,
        });
    }
}