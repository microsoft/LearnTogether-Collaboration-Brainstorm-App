// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'] || require('../../local.settings.json').ResourceConnectionString;

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

export const getEnvUrl = (): string => {
  const uri = new URL(getResourceConnectionString().replace('endpoint=', ''));
  return `${uri.protocol}//${uri.host}`;
};
