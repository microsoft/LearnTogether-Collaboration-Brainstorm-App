import { CommunicationUserToken } from "@azure/communication-identity";
const BASE_URL = 'https://acs-fluid.azurewebsites.net/api';

type CreateThreadResult = {
  threadId: string;
}

export const createTokenAndUser = async (): Promise<CommunicationUserToken> => {
  const url = new URL(`${BASE_URL}/createUserAndToken`);
  url.searchParams.append('code', 'i/lFEz8awKyjJq247mciCo2UfEnp6T3aXh17XX0eGwFpVK/K8gYj3w==');
  const json = await (await fetch(url.toString())).json();
  return json;
}

export const createThread = async (): Promise<CreateThreadResult> => {
  const url = new URL(`${BASE_URL}/createThread`);
  url.searchParams.append('code', 'GXDqN9galnF/4voF/ZrbQwHFlhUfgtTxScuQuggWpmFBArPhJGU85w==');
  const json = await (await fetch(url.toString())).json();
  return json;
}

export const joinThread = async (threadId: string, userId: string, displayName: string): Promise<boolean> => {
  const url = new URL(`${BASE_URL}/joinThread`);
  url.searchParams.append('code', 'Y5zuZGYoCu24z5h7M4d6IV4t0aRfqo5aRVvS/vcuJSefLhq23x/ljg==');
  url.searchParams.append('threadId', threadId);
  url.searchParams.append('userId', userId);
  url.searchParams.append('displayName', displayName);
  return (await fetch(url.toString())).status === 200;
}

export const getEndPointURL = () => {
  return 'https://acs-ui-dev.communication.azure.com';
}