import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ChatComposite, ChatAdapter } from "@azure/communication-react";
import { createAzureCommunicationChatAdapter } from "@azure/communication-react";
import { AzureCommunicationTokenCredential, getIdentifierKind } from "@azure/communication-common";
import { createChatThread, createUserAndToken, joinChatThread } from "../Utils/apis";
import { getThreadIdFromUrl, appendThreadIdToUrl } from "../Utils/UrlHelper";

const ENDPOINT = "[COMMUNICATION_SERVICES_ENDPOINT]";

type ChatPopUpProps = {
  displayName?: string;
}

export const ChatPopUp = (props: ChatPopUpProps): JSX.Element | null => {
  const [adapter, setAdapter] = useState<ChatAdapter>();
  
  useEffect(() => {
    if (!adapter) {
      const createAdapter = async (): Promise<void> => {
        // Get the chat thread or Create a new one if it is the first time.
        var chatThreadId = getThreadIdFromUrl();
        if (!chatThreadId) {
          chatThreadId = (await createChatThread()).threadId;
          appendThreadIdToUrl(chatThreadId);
        }

        // Create a communication user and get a token for it.
        const {user, token} = await createUserAndToken();

        // Join the chat thread of this document
        const displayName = props.displayName!;
        await joinChatThread(user.communicationUserId, displayName, chatThreadId);

        setAdapter(
          await createAzureCommunicationChatAdapter({
            endpointUrl: ENDPOINT,
            userId: getIdentifierKind(user),
            displayName,
            credential: new AzureCommunicationTokenCredential(token),
            threadId: chatThreadId
          })
        );
      };
      createAdapter();
    }
  }, [adapter, props?.displayName]);

  return adapter ?
    <div style={{ position: 'absolute', zIndex: 100, width: 0, height: 0 }}>
      <Draggable defaultPosition={{ x: window.innerWidth - 450, y: window.innerHeight - 650 }}>
        <div style={{ height: '600px', width: '400px', border: 'gray 1px solid', boxShadow: 'rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0' }}>
          <ChatComposite adapter={adapter} />
        </div>
      </Draggable>
    </div> : null;
}
