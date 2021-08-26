/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons, ThemeProvider } from "@fluentui/react";
import { FrsClient } from '@fluid-experimental/frs-client';
import React, { useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import { BrainstormView } from './view/BrainstormView';
import "./view/index.css";
import "./view/App.css";
import { themeNameToTheme } from './view/Themes';
import { connectionConfig, containerSchema } from "./Config";
import { Navbar } from './Navbar';
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';
import useIsSignedIn from './useIsSignedIn';
import UserContext from "./userContext";
import { User } from "./Types";

Providers.globalProvider = new Msal2Provider({
    clientId: '26fa7fdf-ae13-4db0-84f8-8249376812dc'
});

export async function start() {
    initializeIcons();

    const getContainerId = (): { containerId: string; isNew: boolean } => {
        let isNew = false;
        if (location.hash.length === 0) {
            const oldContainerId = sessionStorage.getItem("containerId");
            if (oldContainerId) {
                location.hash = oldContainerId;
            }
            else {
                isNew = true;
                location.hash = Date.now().toString();
            }
        }
        const containerId = location.hash.substring(1);
        sessionStorage.setItem("containerId", containerId);
        return { containerId, isNew };
    };

    const { containerId, isNew } = getContainerId();

    const client = new FrsClient(connectionConfig);

    const frsResources = isNew
        ? await client.createContainer({ id: containerId }, containerSchema)
        : await client.getContainer({ id: containerId }, containerSchema);


    if (!frsResources.fluidContainer.connected) {
        await new Promise<void>((resolve) => {
            frsResources.fluidContainer.once("connected", () => {
                resolve();
            });
        });
    }

    function Main(props: any) {
        const [isSignedIn] = useIsSignedIn();
        const [user, setUser] = useState<User>({userName: '', userId: ''});

        function setSignedInUser(user: User) {
            setUser(user);
            console.log(user);
        }

        return (
            <React.StrictMode>
                <ThemeProvider theme={themeNameToTheme("default")}>
                    <UserContext.Provider value={user}>
                        <Navbar frsResources={frsResources} setSignedInUser={setSignedInUser} />
                        <main>
                            {isSignedIn &&
                                <BrainstormView frsResources={frsResources} />
                            }
                            {!isSignedIn &&
                                <h2>Welcome to Brainstorm! Please sign in to get started.</h2>
                            }
                        </main>
                    </UserContext.Provider>
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
