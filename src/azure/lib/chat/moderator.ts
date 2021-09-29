// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatClient, CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { getEndPoint, getResourceConnectionString } from '../envHelper';
import { CommunicationAccessToken, CommunicationIdentityClient } from '@azure/communication-identity';

export const getToken = (user: CommunicationUserIdentifier): Promise<CommunicationAccessToken> => new CommunicationIdentityClient(getResourceConnectionString()).getToken(user, ['chat']);

export const createThread = async (moderatorId: string, topicName?: string): Promise<string> => {

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken({ communicationUserId: moderatorId })).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEndPoint(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? 'Chat'
  };
  const options: CreateChatThreadOptions = {
    participants: [
      {
        id: {
          communicationUserId: moderatorId
        }
      }
    ]
  };
  const result = await chatClient.createChatThread(request, options);

  const threadID = result.chatThread?.id;
  if (!threadID) {
    throw new Error(`Invalid or missing ID for newly created thread ${result.chatThread}`);
  }
  return threadID;
};


export const joinThread = async (userId: string, displayName: string, moderatorId: string, threadId: string): Promise<void> => {

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken({ communicationUserId: moderatorId })).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEndPoint(), credential);

  const chatThreadClient = chatClient.getChatThreadClient(threadId);

  await chatThreadClient.addParticipants({
    participants: [
      {
        id: { communicationUserId: userId },
        displayName: displayName
      }
    ]
  });
};
