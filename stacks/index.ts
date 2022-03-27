import * as sst from '@serverless-stack/resources';
import StorageStack from './StorageStack';
import ApiStack from './ApiStack';
import AuthStack from './AuthStack';
import FrontendStack from './FontendStack';

export default function main(app: sst.App) {
  const storageStack = new StorageStack(app, 'storage');

  const authStack = new AuthStack(app, 'auth', {
    bucket: storageStack.bucket,
  });

  const apiStack = new ApiStack(app, 'api', {
    table: storageStack.table,
    userPool: authStack.userPool,
    userPoolClient: authStack.userPoolClient,
  });

  new FrontendStack(app, 'frontend', {
    api: apiStack.api,
    userPool: authStack.userPool,
    userPoolClient: authStack.userPoolClient,
    cognitoCfnIdentityPool: authStack.cognitoCfnIdentityPool,
    bucket: storageStack.bucket
  });
}
