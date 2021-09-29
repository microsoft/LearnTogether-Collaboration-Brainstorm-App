// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const getThreadIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const threadId = urlParams.get('threadId');

  return threadId;
};
