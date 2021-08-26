import React, { useRef, useState, useEffect } from 'react';
import { FrsResources } from '@fluid-experimental/frs-client';
import { Providers } from '@microsoft/mgt-element';
import { Login } from '@microsoft/mgt-react';
import { BrainstormModel, createBrainstormModel } from "./BrainstormModel";

export function Navbar(props: { frsResources: FrsResources }) {
    const [model] = useState<BrainstormModel>(
      createBrainstormModel(props.frsResources.fluidContainer));
    const userId = useRef<string>("");

    useEffect(() => {
      const login = document.querySelector("mgt-login");

      function userSignIn(e: Event) {
        console.log("User signed in");
        Providers.globalProvider.graph.client
          .api('me')
          .get()
          .then((me: any) => {
            if (me && me.id) {
              userId.current = me.id;
              console.log(userId.current);
              model.setSignedInUserId(me.id);
            }
          });
      };

      function userSignOut(e: Event) {
        console.log("User logged out");
        if (userId.current) {
          model.deleteSignedOutUserId(userId.current);
        }
      }

      login?.addEventListener("loginCompleted", userSignIn);
      login?.addEventListener("logoutCompleted", userSignOut);

      return () => {
        login?.removeEventListener("loginCompleted", userSignIn);
        login?.removeEventListener("logoutCompleted", userSignOut);
      };
      
    }, []);

    return (
        <header>
          <div className="container">
            <div className="title">Let's Brainstorm</div>
            <div className="login">
              <Login></Login>
            </div>
          </div>
        </header>
      );
}