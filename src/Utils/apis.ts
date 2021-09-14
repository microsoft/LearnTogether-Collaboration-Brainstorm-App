import { CommunicationUserToken } from "@azure/communication-identity";
const BASE_URL = 'https://acs-fluid.azurewebsites.net/api';
export const ENDPOINT = 'https://acs-ui-dev.communication.azure.com';

type CreateThreadResult = {
  threadId: string;
}

export const createTokenAndUser = async (): Promise<CommunicationUserToken> => {
  const url = new URL(`${BASE_URL}/createUserAndToken`);
  const json = await (await fetch(url.toString())).json();
  return json;
}

export const createThread = async (): Promise<CreateThreadResult> => {
  const url = new URL(`${BASE_URL}/createThread`);
  const json = await (await fetch(url.toString())).json();
  return json;
}

export const joinThread = async (threadId: string, userId: string, displayName: string): Promise<boolean> => {
  const url = new URL(`${BASE_URL}/joinThread`);
  url.searchParams.append('threadId', threadId);
  url.searchParams.append('userId', userId);
  url.searchParams.append('displayName', displayName);
  return (await fetch(url.toString())).status === 200;
}
