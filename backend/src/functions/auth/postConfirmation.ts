import { Callback, Context, PostConfirmationTriggerEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

// eslint-disable-next-line
export const main = async (event: PostConfirmationTriggerEvent, _context: Context, callback: Callback) => {
    console.log('postConfirmation!', event);
    const { userPoolId, userName } = event;

    try {
        await adminAddUserToGroup({
            userPoolId,
            username: userName,
            groupName: 'Admin_Group',
        });

        return callback(null, event);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return callback(error, event);
    }
};

type AddUserToGroupParams = {
    userPoolId: string;
    username: string;
    groupName: string;
}

type AddUserToGroupResp = {
    $response: AWS.Response<Record<string, string>, AWS.AWSError>;
}

export function adminAddUserToGroup({ userPoolId, username, groupName }: AddUserToGroupParams): Promise<AddUserToGroupResp> {
    const params = {
        GroupName: groupName,
        UserPoolId: userPoolId,
        Username: username,
    };

    const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
    return cognitoIdp.adminAddUserToGroup(params).promise();
}