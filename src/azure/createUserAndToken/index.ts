import { CommunicationIdentityClient } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { getResourceConnectionString } from "../lib/envHelper";

// Create a user on demand and issue an Azure Communication Services token for chatting.
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Initialize a communication identity client
    const identityClient = new CommunicationIdentityClient(getResourceConnectionString());

    // Create a user and token
    const userInfo = await identityClient.createUserAndToken(['chat']);

    context.res = {
        body: { ...userInfo }
    };
};

export default httpTrigger;