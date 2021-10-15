import { mergeStyles, Spinner } from "@fluentui/react";
import { AzureContainerServices } from "@fluidframework/azure-client";
import { IFluidContainer } from "fluid-framework";
import { useState, useCallback, useEffect } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BrainstormModel, createBrainstormModel } from "../BrainstormModel";
import { Header } from "./Header";
import { ItemsList } from "./ItemsList";
import { NoteSpace } from "./NoteSpace";

export const BrainstormView = (props: { container: IFluidContainer, services: AzureContainerServices }) => {
  const { container, services } = props;
  const [model] = useState<BrainstormModel>(createBrainstormModel(container));

  const audience = services.audience;
  const [members, setMembers] = useState(Array.from(audience.getMembers().values()));
  const authorInfo = audience.getMyself();
  const setMembersCallback = useCallback(() => setMembers(
    Array.from(
      audience.getMembers().values()
    )
  ), [setMembers, audience]);
  
  // Setup a listener to update our users when new clients join the session
  useEffect(() => {
    container.on("connected", setMembersCallback);
    audience.on("membersChanged", setMembersCallback);
    return () => {
      container.off("connected", () => setMembersCallback);
      audience.off("membersChanged", () => setMembersCallback);
    };
  }, [container, audience, setMembersCallback]);

  const wrapperClass = mergeStyles({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0px 20px 0px 20px",
  });

  if (authorInfo === undefined) {
    return <Spinner />;
  }

  return (
    <div className={wrapperClass}>
      <Header
        model={model}
        author={authorInfo}
        members={members}
      />
        <div className="items-list">
          <ItemsList model={model} />
        </div>
        <div>
          <DndProvider backend={HTML5Backend}>
            <NoteSpace
              model={model}
              author={authorInfo}
            />
          </DndProvider>
        </div>
    </div>
  );
};
