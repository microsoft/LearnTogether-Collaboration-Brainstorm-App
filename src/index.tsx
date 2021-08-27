/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons, ThemeProvider } from "@fluentui/react";
import { AzureClient, AzureResources } from '@fluidframework/azure-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrainstormView } from './view/BrainstormView';
import "./view/index.css";
import "./view/App.css";
import { themeNameToTheme } from './view/Themes';
import { connectionConfig, containerSchema } from "./Config";
import { Navbar } from './Navbar';
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';

Providers.globalProvider = new Msal2Provider({
    clientId: '26fa7fdf-ae13-4db0-84f8-8249376812dc'
});

export async function start() {
    initializeIcons();

    async function createOrGetContainer() : 
      Promise<{ containerId: string, azureResources: AzureResources}> {
        let containerId = '';
        // Check if there's a previous containerId (user may have simply logged out)
        const prevContainerId = sessionStorage.getItem("containerId");
        if (location.hash.length === 0) {
            if (prevContainerId) {
                location.hash = prevContainerId;
                containerId = prevContainerId;
            }
        }
        else {
            containerId = location.hash.substring(1);        
        }

        const client = new AzureClient(connectionConfig);
        let azureResources: AzureResources;
        if (containerId) {
            azureResources = await client.getContainer(containerId, containerSchema);
        }
        else {
            azureResources = await client.createContainer(containerSchema);
            // Temporary until attach() is available (per Fluid engineering)
            containerId = azureResources.fluidContainer.id;
            location.hash = containerId;
        }
        sessionStorage.setItem("containerId", containerId);
        return {containerId, azureResources}; 
    }

    let {azureResources} = await createOrGetContainer();

    if (!azureResources.fluidContainer.connected) {
        await new Promise<void>((resolve) => {
            azureResources.fluidContainer.once("connected", () => {
                resolve();
            });
        });
    }

    function Main(props: any) {
        return (
            <React.StrictMode>
                <ThemeProvider theme={themeNameToTheme("default")}>
                    <Navbar />
                    <main>
                        <BrainstormView frsResources={azureResources} />
                    </main>
                </ThemeProvider>
            </React.StrictMode>
        )
    }   

    ReactDOM.render(
        <Main />,
        document.getElementById('root')
    );
}

start().catch((error) => console.error(error));
