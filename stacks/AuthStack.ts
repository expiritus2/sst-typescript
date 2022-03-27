import { Stack, Bucket, App, StackProps } from "@serverless-stack/resources";
import { UserPool, UserPoolClient, IUserPool, IUserPoolClient, CfnIdentityPool } from "aws-cdk-lib/aws-cognito";

type LocalProps = {
    bucket: Bucket;
}

export default class AuthStack extends Stack {
    public userPool: IUserPool;
    public userPoolClient: IUserPoolClient;
    public cognitoCfnIdentityPool: CfnIdentityPool;

    constructor(scope: App, id: string, props: StackProps & LocalProps) {
        super(scope, id, props);

        // Create User Pool
        this.userPool = new UserPool(this, "NotesUserPool", {
            selfSignUpEnabled: true,
            signInAliases: { email: true },
            signInCaseSensitive: false,
            userPoolName: 'Notes User Pool'
        });

        // Create User Pool Client
        this.userPoolClient = new UserPoolClient(this, "NotesUserPoolClient", {
            userPool: this.userPool,
            authFlows: { userPassword: true },
            userPoolClientName: 'Notes User Pool Client',
        });

        this.cognitoCfnIdentityPool = new CfnIdentityPool(this, "NotesIdentityPool", {
            allowUnauthenticatedIdentities: false,
            identityPoolName: 'Notes Identity Pool',
        });

        // const { bucket } = props as LocalProps;

        // Create a Cognito User Pool and Identity Pool
        // this.auth = new Auth(this, "Auth", {
        //     cognito: {
        //         userPool: {
        //             // Users can login with their email and password
        //             signInAliases: { email: true },
        //         },
        //         // triggers: {
        //         //     preAuthentication: "src/preAuthentication.main",
        //         //     postAuthentication: "src/postAuthentication.main",
        //         // },
        //     },
        // });

        // this.auth.attachPermissionsForAuthUsers([
        //     // Policy granting access to a specific folder in the bucket
        //     new iam.PolicyStatement({
        //         actions: ["s3:*"],
        //         effect: iam.Effect.ALLOW,
        //         resources: [
        //             bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
        //         ],
        //     }),
        // ]);

        // Show the auth resources in the output
        this.addOutputs({
            Region: scope.region,
            IdentityPoolId: this.cognitoCfnIdentityPool.ref,
            UserPoolId: this.userPool.userPoolId,
            UserPoolClientId: this.userPoolClient.userPoolClientId,
        });
    }
}