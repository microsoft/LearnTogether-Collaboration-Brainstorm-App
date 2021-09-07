import { CommunicationUserToken } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { createThread } from "../lib/chat/moderator";
import { createUserAndToken, getToken } from "../lib/identityClient";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const moderatorEntity: CommunicationUserToken | undefined = context.bindings.moderatorEntity ? JSON.parse(context.bindings.moderatorEntity?.value) : undefined;

    if (moderatorEntity === undefined) {
        context.bindings.moderatorOutTable = [];
        const moderatorInfo = await createUserAndToken(['chat']);
        context.bindings.moderatorOutTable.push({RowKey: 'Moderator', PartitionKey: 'Moderator', value: moderatorInfo});
        context.log(`Generate a new moderator: ${moderatorInfo.user.communicationUserId}` );
    }

    //TODO: Put expired token into table service instead of refresh it every time
    const threadId = await createThread(moderatorEntity.user.communicationUserId, 'Chat');
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {threadId}
    };

};

export default httpTrigger;
