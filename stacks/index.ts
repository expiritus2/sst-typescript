import * as sst from '@serverless-stack/resources';
import StorageStack from './StorageStack';
import ApiStack from './ApiStack';
import AuthStack from './AuthStack';
import FrontendStack from './FontendStack';
import { IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';

export default function main(app: sst.App) {
  const storageStack = new StorageStack(app, 'storage');

  const authStack = new AuthStack(app, 'auth', {
    bucket: storageStack.bucket,
  });

  const apiStack = new ApiStack(app, 'api', {
    table: storageStack.table,
    userPool: authStack.auth.cognitoUserPool as IUserPool,
    userPoolClient: authStack.auth.cognitoUserPoolClient as IUserPoolClient,
  });

  new FrontendStack(app, 'frontend', {
    api: apiStack.api,
    userPool: authStack.auth.cognitoUserPool as IUserPool,
    userPoolClient: authStack.auth.cognitoUserPoolClient as IUserPoolClient,
    cognitoCfnIdentityPool: authStack.auth.cognitoCfnIdentityPool,
    bucket: storageStack.bucket
  });
}
