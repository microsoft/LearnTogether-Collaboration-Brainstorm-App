import { AzureConnectionConfig, InsecureTokenProvider } from "@fluidframework/azure-client";
import { SharedMap } from "fluid-framework";
import { generateUser } from './utils';

export const useAzureFrs = process.env.REACT_APP_FLUID_CLIENT === "frs";
export const user = generateUser();
export const containerSchema = {
    name: "brainstorm",
    initialObjects: {
        map: SharedMap,
    },
}

export const connectionConfig: AzureConnectionConfig = useAzureFrs ? {
    tenantId: 'm365cda',
    tokenProvider: new InsecureTokenProvider('c979c09e55407ceb62840c7ddfcfb0c1', user),
    orderer: 'https://alfred.eus-1.canary.frs.azure.com',
    storage: 'https://historian.eus-1.canary.frs.azure.com',
} : {
        tenantId: "local",
        tokenProvider: new InsecureTokenProvider("fooBar", user),
        orderer: "http://localhost:7070",
        storage: "http://localhost:7070",
    };