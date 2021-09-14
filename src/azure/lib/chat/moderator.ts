// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { getEnvUrl } from '../envHelper';
import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';
import { getToken } from '../identityClient';

export const createThread = async (moderatorId: string, topicName?: string): Promise<string> => {

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken({communicationUserId: moderatorId}, ['chat', 'voip'])).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEnvUrl(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? GUID_FOR_INITIAL_TOPIC_NAME
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
    tokenRefresher: async () => (await getToken({communicationUserId: moderatorId}, ['chat', 'voip'])).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEnvUrl(), credential);

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
