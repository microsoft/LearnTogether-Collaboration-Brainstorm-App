import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CommunicationUserToken } from "@azure/communication-identity";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';

// Add a user to a chat thread
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Extract the user and chat thread information from the request
    const {userId, displayName, threadId} = req.query;

    // Get the chat thread moderator's user information from the storage. Note: we're assuming the stored token hasn't expired for simplicity.
    const chatThreadModerator: CommunicationUserToken =
        JSON.parse(context.bindings.moderatorEntity.value);
    
    // Initialize a chat client
    const chatClient = new ChatClient(
        process.env.ResourceEndpoint,
        new AzureCommunicationTokenCredential(chatThreadModerator.token))
      
    // Initialize a client for the chat thread
    const chatThreadClient = chatClient.getChatThreadClient(threadId);

    // Add the new user to the chat thread.
    await chatThreadClient.addParticipants({
        participants: [ {
            id: { communicationUserId: userId },
            displayName
        }]
    });

    context.res = { body: `Joined threadId: ${threadId}` };
};

export default httpTrigger;