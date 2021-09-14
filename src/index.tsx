/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons, ThemeProvider } from "@fluentui/react";
import React, { useEffect, useState } from 'react';
import { AzureMember } from "@fluidframework/azure-client";
import ReactDOM from 'react-dom';
import { BrainstormView } from './view/BrainstormView';
import "./view/index.css";
import "./view/App.css";
import { themeNameToTheme } from './view/Themes';
import { Navbar } from './Navbar';
import { getFluidContainer } from "./Utils";
import { ChatPopUp } from "./view/ChatPopUp";

export async function start() {
    initializeIcons();

    let { azureResources } = await getFluidContainer();

    if (!azureResources.fluidContainer.connected) {
        await new Promise<void>((resolve) => {
            azureResources.fluidContainer.once("connected", () => {
                resolve();
            });
        });
    }

    function Main(props: any) {
        const [azureMember, setAzureMember] = useState<AzureMember | undefined>(undefined);

        useEffect(() => {
            if (!azureResources.containerServices.audience.getMyself()) {
                azureResources.containerServices.audience.once("membersChanged", () => { setAzureMember(azureResources.containerServices.audience.getMyself()) });
            } else {
                setAzureMember(azureResources.containerServices.audience.getMyself());
            }
        }, []);

        return (
            <React.StrictMode>
                <ThemeProvider theme={themeNameToTheme("default")}>
                    {azureMember && <div style={{ position: 'absolute', zIndex: 100 }}>
                        <ChatPopUp author={azureMember} />
                    </div>}
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
