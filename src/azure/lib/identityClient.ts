// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationAccessToken,
  CommunicationIdentityClient,
  CommunicationUserToken,
  TokenScope
} from '@azure/communication-identity';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { OperationOptions } from '@azure/core-http';
import { getResourceConnectionString } from './envHelper';

export const getToken = (
  user: CommunicationUserIdentifier,
  scopes: TokenScope[],
  options?: OperationOptions
): Promise<CommunicationAccessToken> => new CommunicationIdentityClient(getResourceConnectionString()).getToken(user, scopes);
export const createUserAndToken = (scopes: TokenScope[]): Promise<CommunicationUserToken> =>
  new CommunicationIdentityClient(getResourceConnectionString()).createUserAndToken(scopes);
