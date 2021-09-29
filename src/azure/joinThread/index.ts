import { CommunicationUserToken } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { joinThread } from "../lib/chat/moderator";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const moderatorEntity: CommunicationUserToken =JSON.parse(context.bindings.moderatorEntity?.value);

    const {threadId, userId, displayName} = req.query;

    await joinThread(userId, displayName, moderatorEntity.user.communicationUserId, threadId);

    context.res = {
        body: `Joined threadId: ${threadId}`
    };

};

export default httpTrigger;