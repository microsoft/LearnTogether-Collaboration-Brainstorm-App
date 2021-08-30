/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons, ThemeProvider } from "@fluentui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { BrainstormView } from './view/BrainstormView';
import "./view/index.css";
import "./view/App.css";
import { themeNameToTheme } from './view/Themes';
import { Navbar } from './Navbar';
import { getFluidContainer } from "./Utils";

export async function start() {
    initializeIcons();

    let {azureResources} = await getFluidContainer();

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
