import { Stack, Bucket, App, StackProps, Auth, AuthUserPoolTriggers } from "@serverless-stack/resources";
import { IUserPool, IUserPoolClient, CfnIdentityPool } from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

type LocalProps = {
    bucket: Bucket;
}

export default class AuthStack extends Stack {
    public auth: Auth;
    public userPool: IUserPool;
    public userPoolClient: IUserPoolClient;
    public cognitoCfnIdentityPool: CfnIdentityPool;
    public userPoolTriggers: AuthUserPoolTriggers;

    constructor(scope: App, id: string, props: StackProps & LocalProps) {
        super(scope, id, props);

        // Create a Cognito User Pool and Identity Pool
        this.auth = new Auth(this, "Auth", {
            cognito: {
                userPool: {
                    // Users can login with their email and password
                    signInAliases: { email: true },
                    selfSignUpEnabled: true,
                    signInCaseSensitive: false,
                    userPoolName: 'Notes User Pool',
                },
                userPoolClient: {
                    authFlows: { userPassword: true },
                    userPoolClientName: 'Notes User Pool Client',
                },
                triggers: {
                    postConfirmation: 'backend/src/functions/auth/postConfirmation.main'
                },
            },
        });

        this.auth.attachPermissionsForTrigger('postConfirmation', [
            new iam.PolicyStatement({
                actions: ['cognito-idp:AdminAddUserToGroup'],
                effect: iam.Effect.ALLOW,
                resources: ['*'],
            }),
        ]);

        // Show the auth resources in the output
        this.addOutputs({
            Region: scope.region,
            IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
            UserPoolId: this.auth.cognitoUserPool!.userPoolId,
            UserPoolClientId: this.auth.cognitoUserPoolClient!.userPoolClientId,
        });
    }
}