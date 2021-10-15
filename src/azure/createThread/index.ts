import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CommunicationIdentityClient, CommunicationUserToken } from "@azure/communication-identity";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';

const getOrCreateChatModerator = async (context: Context): Promise<CommunicationUserToken> => {
    if (context.bindings.moderatorEntity)
     return JSON.parse(context.bindings.moderatorEntity.value);

    context.bindings.moderatorOutTable = [];
    // Create a new moderator user and token
    const moderator = await new CommunicationIdentityClient(process.env.ResourceConnectionString).createUserAndToken(["chat"]);
    // Store the moderator with token
    context.bindings.moderatorOutTable.push({RowKey: 'Moderator', PartitionKey: 'Moderator', value: moderator});
    return moderator;
};

// Create a chat thread.
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Get the chat thread moderator's user information from the storage
    const chatThreadModerator = await getOrCreateChatModerator(context);

    // Initialize a chat client
    const chatClient = new ChatClient(
        process.env.ResourceEndpoint,
        new AzureCommunicationTokenCredential(chatThreadModerator.token));

    // Create a chat thread
    const result = await chatClient.createChatThread({ topic: 'Brainstorming'});
    
    context.res = {
        body: { threadId: result.chatThread.id }
    };
};

export default httpTrigger;
