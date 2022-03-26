import * as sst from '@serverless-stack/resources';
import StorageStack from './StorageStack';
import ApiStack from './ApiStack';
import AuthStack from './AuthStack';
import FrontendStack from './FontendStack';

export default function main(app: sst.App) {
  const storageStack = new StorageStack(app, 'storage');

  const apiStack = new ApiStack(app, 'api', {
    table: storageStack.table
  });

  const authStack = new AuthStack(app, 'auth', {
    api: apiStack.api,
    bucket: storageStack.bucket,
  });

  new FrontendStack(app, 'frontend', {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: storageStack.bucket
  });
}
