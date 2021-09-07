import { CommunicationUserToken } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { createUser, createUserAndToken, getToken } from "../lib/identityClient";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userInfo = await createUserAndToken(['chat']);

    context.res = {
        body: { ...userInfo }
    };
};

export default httpTrigger;