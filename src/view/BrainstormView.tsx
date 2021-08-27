import { mergeStyles, Spinner } from "@fluentui/react";
import { AzureResources } from "@fluidframework/azure-client";
import { useState, useCallback, useEffect } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BrainstormModel, createBrainstormModel } from "../BrainstormModel";
import { Header } from "./Header";
import { ItemsList } from "./ItemsList";
import { NoteSpace } from "./NoteSpace";

export const BrainstormView = (props: { frsResources: AzureResources }) => {
  const { frsResources: { fluidContainer, containerServices } } = props;
  const [model] = useState<BrainstormModel>(createBrainstormModel(fluidContainer));

  const audience = containerServices.audience;
  const [members, setMembers] = useState(Array.from(audience.getMembers().values()));
  const authorInfo = audience.getMyself();
  const setMembersCallback = useCallback(() => setMembers(
    Array.from(
      audience.getMembers().values()
    )
  ), [setMembers, audience]);
  // Setup a listener to update our users when new clients join the session
  useEffect(() => {
    fluidContainer.on("connected", setMembersCallback);
    audience.on("membersChanged", setMembersCallback);
    return () => {
      fluidContainer.off("connected", () => setMembersCallback);
      audience.off("membersChanged", () => setMembersCallback);
    };
  }, [fluidContainer, audience, setMembersCallback]);

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
