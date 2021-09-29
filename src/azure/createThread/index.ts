import { CommunicationIdentityClient, CommunicationUserToken } from "@azure/communication-identity";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { createThread } from "../lib/chat/moderator";
import { getResourceConnectionString } from "../lib/envHelper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const moderatorEntity: CommunicationUserToken | undefined = context.bindings.moderatorEntity ? JSON.parse(context.bindings.moderatorEntity?.value) : undefined;

    if (moderatorEntity === undefined) {
        context.bindings.moderatorOutTable = [];
        const moderatorInfo = await new CommunicationIdentityClient(getResourceConnectionString()).createUserAndToken(['chat']);
        context.bindings.moderatorOutTable.push({RowKey: 'Moderator', PartitionKey: 'Moderator', value: moderatorInfo});
        context.log(`Generate a new moderator: ${moderatorInfo.user.communicationUserId}` );
    }

    const threadId = await createThread(moderatorEntity.user.communicationUserId, 'Chat');
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {threadId}
    };

};

export default httpTrigger;
