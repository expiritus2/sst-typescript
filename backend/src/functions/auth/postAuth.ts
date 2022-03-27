import apiHandler from "../../util/apiHandler";

// eslint-disable-next-line
export const main = apiHandler(async (event: any) => {
    console.log('postAuth', event);

    // Return the matching list of items in response body
    return { body: { success: 'OK' } };
});