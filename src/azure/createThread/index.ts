import { CommunicationUserToken } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { createThread } from "../lib/chat/moderator";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const moderatorEntity: CommunicationUserToken = JSON.parse(context.bindings.moderatorEntity?.value);

    const threadId = await createThread(moderatorEntity.user.communicationUserId, 'Chat');
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {threadId}
    };

};

export default httpTrigger;
