// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const appendThreadIdToUrl = (threadId: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('threadId');
  url.searchParams.append('threadId', threadId);
  window.history.pushState({}, document.title, url.toString());
};
