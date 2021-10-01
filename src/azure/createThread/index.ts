import { CommunicationUserToken } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import { getResourceEndPoint } from '../lib/envHelper';

// Create a chat thread.
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Get the chat thread moderator's user information from the storage 
    const chatThreadModerator: CommunicationUserToken
        = JSON.parse(context.bindings.moderatorEntity.value);

    // Initialize a chat client
    const chatClient = new ChatClient(
        getResourceEndPoint(),
        new AzureCommunicationTokenCredential(chatThreadModerator.token));

    // Create a chat thread
    const result = await chatClient.createChatThread(
        { topic: 'Brainstorming'},
        { participants: [ { id: chatThreadModerator.user } ] });
    
    context.res = {
        body: { threadId: result.chatThread.id }
    };
};

export default httpTrigger;
