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

    let {container, services} = await getFluidContainer();

    if (!container.connected) {
        await new Promise<void>((resolve) => {
            container.once("connected", () => {
                resolve();
            });
        });
    }

    function Main(props: any) {
        const [fluidUser, setFluidUser] = useState<AzureMember | undefined>(undefined);

        useEffect(() => {
            if (!services.audience.getMyself()) {
                services.audience.once("membersChanged", () => { setFluidUser(services.audience.getMyself()) });
            } else {
                setFluidUser(services.audience.getMyself());
            }
        }, []);

        return (
            <React.StrictMode>
                <ThemeProvider theme={themeNameToTheme("default")}>
                    {fluidUser && <ChatPopUp displayName={fluidUser.userName} />}
                    <Navbar />
                    <main>
                        <BrainstormView container={container} services={services} />
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
