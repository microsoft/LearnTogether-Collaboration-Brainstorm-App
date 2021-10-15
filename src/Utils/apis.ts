import { CommunicationUserToken } from "@azure/communication-identity";

const BASE_URL = "[FUNCTIONS_URL]";

type CreateThreadResult = {
  threadId: string;
}

export const createUserAndToken = async (): Promise<CommunicationUserToken> => {
  const url = new URL(`${BASE_URL}/createUserAndToken`);
  const json = await (await fetch(url.toString())).json();
  return json;
}

export const createChatThread = async (): Promise<CreateThreadResult> => {
  const url = new URL(`${BASE_URL}/createThread`);
  const json = await (await fetch(url.toString())).json();
  return json;
}

export const joinChatThread = async (userId: string, displayName: string, threadId: string): Promise<boolean> => {
  const url = new URL(`${BASE_URL}/joinThread`);
  url.searchParams.append("threadId", threadId);
  url.searchParams.append("userId", userId);
  url.searchParams.append("displayName", displayName);
  return (await fetch(url.toString())).status === 200;
}
