import React, { useEffect, useState } from "react";
import Draggable from 'react-draggable';
import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapter } from "@azure/communication-react";
import { AzureCommunicationTokenCredential, getIdentifierKind } from "@azure/communication-common";
import { createThread, createTokenAndUser, ENDPOINT, joinThread } from "../Utils/apis";
import { getThreadIdFromUrl } from "../Utils/getThreadIdFromUrl";
import { appendThreadIdToUrl } from "../Utils/appendThreadIdToUrl";

type ChatPopUpProps = {
  displayName?: string;
}

export const ChatPopUp = (props: ChatPopUpProps): JSX.Element | null => {

  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (!adapter) {
      const createAdapter = async (): Promise<void> => {
        const tokenAndUser = await createTokenAndUser();
        const displayName = props?.displayName ?? 'Empty Name';
        const threadId = getThreadIdFromUrl() ?? (await createThread()).threadId;

        await joinThread(threadId, tokenAndUser.user.communicationUserId, displayName);

        appendThreadIdToUrl(threadId);

        setAdapter(
          await createAzureCommunicationChatAdapter({
            endpointUrl: ENDPOINT,
            userId: getIdentifierKind(tokenAndUser.user),
            displayName,
            credential: new AzureCommunicationTokenCredential(tokenAndUser.token),
            threadId
          })
        );
      };
      createAdapter();
    }
  }, [adapter, props?.displayName]);

  return adapter ?
    <div style={{ position: 'absolute', zIndex: 100, width: 0, height: 0 }}>
      <Draggable
        defaultPosition={{ x: window.innerWidth - 450, y: window.innerHeight - 650 }}
      >
        <div style={{ height: '600px', width: '400px', border: 'gray 1px solid', boxShadow: 'rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0' }}><ChatComposite adapter={adapter} /></div>
      </Draggable>
    </div> : null;
}
