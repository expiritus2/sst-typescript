import * as sst from '@serverless-stack/resources';

export enum Stage {
    LOCAL = 'local',
    DEV = 'dev',
    STAGING = 'staging',
    PROD = 'prod'
}

export const isLocalStage = (scope: sst.App) => {
    return scope.stage === Stage.LOCAL;
}