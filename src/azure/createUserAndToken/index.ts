import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CommunicationIdentityClient } from "@azure/communication-identity";

// Create a user on demand and issue an Azure Communication Services token for chatting.
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Initialize a communication identity client
    const identityClient = new CommunicationIdentityClient(process.env.ResourceConnectionString);

    // Create a user and token
    const { user, token, expiresOn } = await identityClient.createUserAndToken(['chat']);

    context.res = {
        body: { user, token, expiresOn }
    };
};

export default httpTrigger;