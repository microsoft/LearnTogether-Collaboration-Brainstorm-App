import { CommunicationIdentityClient } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { getResourceConnectionString } from "../lib/envHelper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userInfo = await new CommunicationIdentityClient(getResourceConnectionString()).createUserAndToken(['chat']);

    context.res = {
        body: { ...userInfo }
    };
};

export default httpTrigger;