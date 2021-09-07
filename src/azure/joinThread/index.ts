import { CommunicationUserToken } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { joinThread } from "../lib/chat/moderator";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const moderatorEntity: CommunicationUserToken | undefined = context.bindings.moderatorEntity ? JSON.parse(context.bindings.moderatorEntity?.value) : undefined;

    if (moderatorEntity === undefined) {
        context.res = {
            status: 503,
            body: 'Please call create thread to initial a moderator first! - No moderator found: createThread must be called before join'
        };
        context.log(`No moderator found: createThread must be called before join` );
    }

    const {threadId, userId, displayName} = req.query;

    await joinThread(userId, displayName, moderatorEntity.user.communicationUserId, threadId);

    context.res = {
        body: `Joined threadId: ${threadId}`
    };

};

export default httpTrigger;